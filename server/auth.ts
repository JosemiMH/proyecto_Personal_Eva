import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { insertUserSchema, User as SelectUser } from "@shared/schema";
import rateLimit from "express-rate-limit";

const scryptAsync = promisify(scrypt);

const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many login attempts, please try again later" },
});

export function requireAuth(req: any, res: any, next: any) {
    if (!req.isAuthenticated?.()) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    next();
}

function withoutPassword(user: SelectUser) {
    const { password: _password, ...safeUser } = user;
    return safeUser;
}

async function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
    const configuredSecret = process.env.SESSION_SECRET?.trim();
    const sessionSettings: session.SessionOptions = {
        secret: configuredSecret || randomBytes(32).toString("hex"),
        resave: false,
        saveUninitialized: false,
        store: storage.sessionStore,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: app.get("env") === "production",
            maxAge: 8 * 60 * 60 * 1000,
        },
    };

    if (!configuredSecret) {
        console.warn("SESSION_SECRET is not configured; admin sessions will reset when the server restarts.");
    }

    if (app.get("env") === "production") {
        app.set("trust proxy", 1);
    }

    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy(async (username, password, done) => {
            const user = await storage.getUserByUsername(username);
            if (!user || !(await comparePasswords(password, user.password))) {
                return done(null, false);
            } else {
                return done(null, user);
            }
        }),
    );

    passport.serializeUser((user, done) => done(null, (user as SelectUser).id));
    passport.deserializeUser(async (id: number, done) => {
        const user = await storage.getUser(id);
        done(null, user);
    });

    app.post("/api/login", loginLimiter, passport.authenticate("local"), (req, res) => {
        res.status(200).json(withoutPassword(req.user as SelectUser));
    });

    app.post("/api/register", async (req, res, next) => {
        if (app.get("env") === "production" && !req.isAuthenticated()) {
            return res.status(403).json({ message: "Administrator registration is disabled" });
        }

        try {
            const credentials = insertUserSchema.parse(req.body);
            const existingUser = await storage.getUserByUsername(credentials.username);
            if (existingUser) {
                return res.status(400).send("Username already exists");
            }

            const hashedPassword = await hashPassword(credentials.password);
            const user = await storage.createUser({
                ...credentials,
                password: hashedPassword,
            });

            req.login(user, (err) => {
                if (err) return next(err);
                res.status(201).json(withoutPassword(user));
            });
        } catch (err) {
            next(err);
        }
    });

    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });

    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        res.json(withoutPassword(req.user as SelectUser));
    });
}
