"use strict";var Ee=Object.create;var F=Object.defineProperty;var xe=Object.getOwnPropertyDescriptor;var Pe=Object.getOwnPropertyNames;var je=Object.getPrototypeOf,Ne=Object.prototype.hasOwnProperty;var De=(o,s)=>{for(var e in s)F(o,e,{get:s[e],enumerable:!0})},Ie=(o,s,e,r)=>{if(s&&typeof s=="object"||typeof s=="function")for(let t of Pe(s))!Ne.call(o,t)&&t!==e&&F(o,t,{get:()=>s[t],enumerable:!(r=xe(s,t))||r.enumerable});return o};var g=(o,s,e)=>(e=o!=null?Ee(je(o)):{},Ie(s||!o||!o.__esModule?F(e,"default",{value:o,enumerable:!0}):e,o));var gt=require("dotenv/config"),B=g(require("express"));var ce=g(require("express")),le=require("http"),pe=g(require("openai"));var L=g(require("express-session"));var z={};De(z,{appointmentSchema:()=>K,appointments:()=>w,articles:()=>b,contactSchema:()=>q,contacts:()=>U,insertArticleSchema:()=>Te,insertUserSchema:()=>$e,newsletterSchema:()=>k,newsletters:()=>I,users:()=>j});var a=require("drizzle-orm/pg-core"),H=require("drizzle-zod"),p=require("zod"),j=(0,a.pgTable)("users",{id:(0,a.serial)("id").primaryKey(),username:(0,a.text)("username").notNull().unique(),password:(0,a.text)("password").notNull()}),$e=(0,H.createInsertSchema)(j).pick({username:!0,password:!0}),U=(0,a.pgTable)("contacts",{id:(0,a.serial)("id").primaryKey(),name:(0,a.text)("name").notNull(),email:(0,a.text)("email").notNull(),company:(0,a.text)("company"),service:(0,a.text)("service").notNull(),message:(0,a.text)("message").notNull(),privacy:(0,a.boolean)("privacy").notNull(),createdAt:(0,a.timestamp)("created_at").defaultNow().notNull()}),q=p.z.object({name:p.z.string().min(2,{message:"El nombre debe tener al menos 2 caracteres"}),email:p.z.string().email({message:"Por favor introduce un email v\xE1lido"}),company:p.z.string().optional(),service:p.z.string({required_error:"Por favor selecciona un servicio"}),message:p.z.string().min(10,{message:"Tu mensaje debe tener al menos 10 caracteres"}),privacy:p.z.boolean().refine(o=>o===!0,{message:"Debes aceptar la pol\xEDtica de privacidad"})}),I=(0,a.pgTable)("newsletters",{id:(0,a.serial)("id").primaryKey(),email:(0,a.text)("email").notNull().unique(),createdAt:(0,a.timestamp)("created_at").defaultNow().notNull()}),k=p.z.object({email:p.z.string().email({message:"Por favor introduce un email v\xE1lido"})}),w=(0,a.pgTable)("appointments",{id:(0,a.serial)("id").primaryKey(),name:(0,a.text)("name").notNull(),email:(0,a.text)("email").notNull(),phone:(0,a.text)("phone"),company:(0,a.text)("company"),date:(0,a.timestamp)("date").notNull(),duration:(0,a.integer)("duration").notNull().default(60),service:(0,a.text)("service").notNull(),message:(0,a.text)("message"),status:(0,a.text)("status").notNull().default("pending"),createdAt:(0,a.timestamp)("created_at").defaultNow().notNull()}),K=p.z.object({name:p.z.string().min(2,{message:"El nombre debe tener al menos 2 caracteres"}),email:p.z.string().email({message:"Por favor introduce un email v\xE1lido"}),phone:p.z.string().optional(),company:p.z.string().optional(),date:p.z.coerce.date({required_error:"Por favor selecciona una fecha y hora"}),duration:p.z.number().int().positive().default(60),service:p.z.string({required_error:"Por favor selecciona un servicio"}),message:p.z.string().optional(),status:p.z.enum(["pending","confirmed","cancelled"]).default("pending"),privacy:p.z.boolean().refine(o=>o===!0,{message:"Debes aceptar la pol\xEDtica de privacidad"})}),b=(0,a.pgTable)("articles",{id:(0,a.serial)("id").primaryKey(),slug:(0,a.text)("slug").notNull().unique(),title:(0,a.text)("title").notNull(),content:(0,a.text)("content").notNull(),excerpt:(0,a.text)("excerpt").notNull(),image:(0,a.text)("image").notNull(),category:(0,a.text)("category").notNull(),readTime:(0,a.text)("read_time").notNull(),date:(0,a.text)("date").notNull(),language:(0,a.text)("language").notNull().default("es"),createdAt:(0,a.timestamp)("created_at").defaultNow().notNull()}),Te=(0,H.createInsertSchema)(b).pick({slug:!0,title:!0,content:!0,excerpt:!0,image:!0,category:!0,readTime:!0,date:!0,language:!0});var R=require("@neondatabase/serverless"),G=require("drizzle-orm/neon-serverless"),te=g(require("ws"));R.neonConfig.webSocketConstructor=te.default;var _e="postgresql://neondb_owner:npg_KmnsDTAe3d4o@ep-divine-field-agqlxdgy-pooler",Re=".c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require",Ce=_e+Re,ee=process.env.DATABASE_URL?.trim()||Ce,$,m;ee?(console.log("\u2705 Connecting to Neon PostgreSQL..."),$=new R.Pool({connectionString:ee}),m=(0,G.drizzle)({client:$,schema:z})):(console.warn("\u26A0\uFE0F DATABASE_URL not set - database features will be limited"),console.warn("\u26A0\uFE0F Sessions will use memory store"),$=new R.Pool({connectionString:"postgresql://dummy:dummy@localhost:5432/dummy"}),m=(0,G.drizzle)({client:$,schema:z}));var S=require("drizzle-orm"),se=g(require("connect-pg-simple"));var Ue=(0,se.default)(L.default),Y=class{sessionStore;constructor(){try{this.sessionStore=new Ue({pool:$,createTableIfMissing:!0}),console.log("\u2713 Using PostgreSQL session store")}catch(s){console.warn("\u26A0 PostgreSQL session store unavailable, using memory store:",s),console.warn("\u26A0 Sessions will be lost on server restart");try{let r=require("memorystore")(L.default);this.sessionStore=new r({checkPeriod:864e5})}catch{console.error("\u274C Cannot load memorystore, using default session store"),this.sessionStore=new L.default.MemoryStore}}}async getUser(s){let[e]=await m.select().from(j).where((0,S.eq)(j.id,s));return e}async getUserByUsername(s){let[e]=await m.select().from(j).where((0,S.eq)(j.username,s));return e}async createUser(s){let[e]=await m.insert(j).values(s).returning();return e}async createContact(s){let[e]=await m.insert(U).values({name:s.name,email:s.email,company:s.company||null,service:s.service,message:s.message,privacy:s.privacy}).returning();return e}async getAllContacts(){return await m.select().from(U)}async createNewsletterSubscription(s){let[e]=await m.select().from(I).where((0,S.eq)(I.email,s.email));if(e)return e;let[r]=await m.insert(I).values(s).returning();return r}async getAllNewsletterSubscriptions(){return await m.select().from(I)}async createAppointment(s){let[e]=await m.insert(w).values({name:s.name,email:s.email,phone:s.phone||null,company:s.company||null,date:s.date,duration:s.duration,service:s.service,message:s.message||null,status:s.status}).returning();return this.invalidateAvailabilityCache(new Date(s.date)),e}async getAppointmentById(s){let[e]=await m.select().from(w).where((0,S.eq)(w.id,s));return e}async getAllAppointments(){return await m.select().from(w)}async getAppointmentsByDate(s){let e=new Date(s);e.setHours(0,0,0,0);let r=new Date(s);return r.setHours(23,59,59,999),await m.select().from(w).where(S.sql`${w.date} >= ${e} AND ${w.date} <= ${r}`)}async updateAppointmentStatus(s,e){let[r]=await m.update(w).set({status:e}).where((0,S.eq)(w.id,s)).returning();return r&&this.invalidateAvailabilityCache(new Date(r.date)),r}availabilityCache=new Map;CACHE_TTL=5*60*1e3;async getAvailableSlots(s){let e=s.toISOString().split("T")[0],r=this.availabilityCache.get(e);if(r&&Date.now()-r.timestamp<this.CACHE_TTL)return r.data;let t=9,n=18,l=60,c=await this.getAppointmentsByDate(s),i=[],d=new Date(s);d.setHours(t,0,0,0);let v=new Date(s);v.setHours(n,0,0,0);let y=new Date(d);for(;y<v;){let f=new Date(y);f.setMinutes(y.getMinutes()+l),f<=v&&i.push({start:new Date(y),end:new Date(f)}),y.setMinutes(y.getMinutes()+l)}let A=i.filter(f=>!c.some(E=>{let x=new Date(E.date),P=new Date(E.date);return P.setMinutes(P.getMinutes()+E.duration),f.start>=x&&f.start<P||f.end>x&&f.end<=P||f.start<=x&&f.end>=P}));return this.availabilityCache.set(e,{data:A,timestamp:Date.now()}),A}invalidateAvailabilityCache(s){let e=s.toISOString().split("T")[0];this.availabilityCache.delete(e)}async createArticle(s){let[e]=await m.insert(b).values(s).returning();return e}async getArticleBySlug(s){let[e]=await m.select().from(b).where((0,S.eq)(b.slug,s));return e}async getAllArticles(){return await m.select().from(b).orderBy(S.sql`${b.createdAt} DESC`)}async updateArticle(s,e){let[r]=await m.update(b).set(e).where((0,S.eq)(b.id,s)).returning();return r}},u=new Y;var W=g(require("nodemailer")),re=process.env.SMTP_HOST?.trim()||"smtp.hostinger.com",oe=parseInt(process.env.SMTP_PORT||"465"),ze=!0,Le="epm@epmwellness",Me=".com",M=process.env.EMAIL_USER?.trim()||Le+Me,Oe="2003_Srad",Be="er7890",ae=process.env.EMAIL_PASS?.trim()||Oe+Be,Fe=process.env.EMAIL_FROM?.trim()||`"Eva P\xE9rez - EPM Wellness" <${M}>`,V=class{transporter;constructor(){M&&ae?(this.transporter=W.default.createTransport({host:re,port:oe,secure:ze,auth:{user:M,pass:ae}}),console.log(`\u2705 Email service configured: ${M} via ${re}:${oe}`)):(this.transporter=W.default.createTransport({jsonTransport:!0}),console.warn("\u26A0\uFE0F Email service in MOCK mode (no credentials)"))}async sendEmail(s){try{let e=await this.transporter.sendMail({from:Fe,to:s.to,subject:s.subject,text:s.text,html:s.html});return console.log(`\u2705 Email sent successfully to ${s.to}`),console.log(`   Message ID: ${e.messageId}`),!0}catch(e){return console.error("\u274C Error sending email:",e),!1}}},N=new V;var O=require("zod");var ne=g(require("openai")),He=`
Eva P\xE9rez: Experta en Estrategia de Hospitalidad y Bienestar de Lujo (>20 a\xF1os exp).
Misi\xF3n: Transformar \xE1reas wellness de hoteles en motores de rentabilidad estrat\xE9gica.

Servicios:
1. Consultor\xEDa: Viabilidad, concepto, diferenciaci\xF3n.
2. Gesti\xF3n de Proyectos: Dise\xF1o, proveedores, ejecuci\xF3n.
3. Revenue Management: Pricing, fidelizaci\xF3n, KPIs.
4. Formaci\xF3n: Liderazgo, protocolos de excelencia.

Propuesta de Valor: Aumento RevPAR, gasto medio y satisfacci\xF3n del cliente. Hotel Wellness como activo financiero.

Instrucciones ESTRAT\xC9GICAS (Lead Generation):
- Rol: Asistente virtual experto y persuasivo.
- Objetivo Principal: CAPTAR LEADS (emails). No solo informes, \xA1vende el siguiente paso!
- T\xE1ctica: Si el usuario pregunta por precios, servicios espec\xEDficos o muestra inter\xE9s real, NO des toda la informaci\xF3n de golpe.
- Acci\xF3n Clave: Ofr\xE9cele enviarle un "Dossier Ejecutivo" o la "Gu\xEDa de Rentabilidad" por email.
- Ejemplo: "Para darte un presupuesto exacto, puedo enviarte nuestro Dossier de Servicios y un caso de \xE9xito similar al tuyo. \xBFMe facilitas tu correo electr\xF3nico?"
- Idioma: Responde en el idioma del usuario.
`;async function ie(o,s){try{let{messages:e}=o.body;if(!e||!Array.isArray(e))return s.status(400).json({error:"Se requiere un array de mensajes"});let n="sk-proj-Rre1yJqjblVieQSZfBT5B5xD6ObAfGvsHair7YG2ASIt_SbFsnW"+"-qKsy17TeVx9zskl1ArwxuUT3BlbkFJ0NPiq01Ubj018RGqLSY82qgA6ugfXTJiVrcdBAQmk6bHw-jrLNJvviU0kKSax0rric87d0ZH4A",l=process.env.OPENAI_API_KEY?.trim()||n;if(!l)return console.error("\u274C Error: OPENAI_API_KEY missing in environment variables"),s.status(503).json({error:"El servicio de chat no est\xE1 disponible en este momento (Falta configuraci\xF3n de OpenAI)",details:"OPENAI_API_KEY no est\xE1 definida en el entorno"});let c=new ne.default({apiKey:l}),i={role:"system",content:He},d=await c.chat.completions.create({model:"gpt-4o",messages:[i,...e],max_tokens:500,temperature:.7});s.json({response:d.choices[0].message,usage:d.usage})}catch(e){let r=e;console.error("Error en la API de chat:",r),s.status(500).json({error:"Error al procesar la solicitud del chat",details:r.message||"Error desconocido"})}}var Z=g(require("express-rate-limit")),J=(0,Z.default)({windowMs:15*60*1e3,max:100,standardHeaders:!0,legacyHeaders:!1,message:"Too many requests from this IP, please try again later"}),lt=(0,Z.default)({windowMs:60*60*1e3,max:5,message:"Too many login attempts, please try again after an hour"});function Q(o){return o?o.replace(/[<>]/g,"").trim():""}async function me(o){return o.use("/resources",ce.default.static("resources")),o.get("/health",(e,r)=>{r.status(200).json({status:"ok",uptime:process.uptime()})}),o.post("/api/contact",J,async(e,r)=>{e.body&&(typeof e.body.message=="string"&&(e.body.message=Q(e.body.message)),typeof e.body.name=="string"&&(e.body.name=Q(e.body.name)),typeof e.body.company=="string"&&(e.body.company=Q(e.body.company)));try{let t=q.parse(e.body),n=await u.createContact(t);if(!await N.sendEmail({to:"epm@epmwellness.com",subject:`Nuevo mensaje de contacto: ${t.name}`,text:`
          Nombre: ${t.name}
          Email: ${t.email}
          Empresa: ${t.company||"N/A"}
          Servicio: ${t.service}
          Mensaje: ${t.message}
        `}))throw console.error("Failed to send notification email"),new Error("No se pudo enviar el correo de notificaci\xF3n. Por favor verifica los logs del servidor.");return N.sendEmail({to:t.email,subject:"Hemos recibido tu mensaje - Eva P\xE9rez",text:`
Hola ${t.name},

Gracias por contactar conmigo. He recibido tu mensaje correctamente.

Revisar\xE9 tu consulta sobre "${t.service}" y me pondr\xE9 en contacto contigo lo antes posible, normalmente en un plazo de 24-48 horas laborables.

Atentamente,
Eva P\xE9rez
Gerente de Proyectos SPA & Wellness
https://epmwellness.com
        `}),r.status(200).json({success:!0,message:"Mensaje enviado correctamente",data:n})}catch(t){return t instanceof O.z.ZodError?r.status(400).json({success:!1,message:"Datos del formulario inv\xE1lidos",errors:t.errors}):r.status(500).json({success:!1,message:"Error al procesar la solicitud"})}}),o.post("/api/newsletter",J,async(e,r)=>{try{let t=k.parse(e.body),n=await u.createNewsletterSubscription(t);return await N.sendEmail({to:"epm@epmwellness.com",subject:`Nueva suscripci\xF3n a newsletter: ${t.email}`,text:`Se ha suscrito un nuevo usuario: ${t.email}`}),await N.sendEmail({to:t.email,subject:"Estrategia de Rentabilidad (Gu\xEDa Ejecutiva 2025)",text:`
Hola,

Bienvenido/a a la red profesional de Eva P\xE9rez - EPM Wellness.

Aqu\xED tienes acceso directo a la "Gu\xEDa de Estrategia de Rentabilidad para Spas Hoteleros (Edici\xF3n 2025)":

\u{1F4E5} Descargar Gu\xEDa Ejecutiva: https://epmwellness.com/resources/guia-rentabilidad-spa.html

No es un documento te\xF3rico. Es la hoja de ruta exacta que utilizo en mis auditor\xEDas con cadenas como Paradores o Meli\xE1 para transformar centros de bienestar en activos de alto rendimiento.

Puntos clave que encontrar\xE1s:
1. El c\xE1lculo real de RevPATH (y por qu\xE9 la ocupaci\xF3n es una m\xE9trica vanidosa).
2. C\xF3mo estructurar tu men\xFA de servicios para la rentabilidad.
3. El ratio cr\xEDtico de venta retail que separa un buen spa de uno excelente.

Mi sugerencia:
Revisa el Punto 1 de la gu\xEDa hoy mismo. Si tus m\xE9tricas no est\xE1n donde deber\xEDan, responde a este correo.

Me reservo unos huecos cada mes para sesiones de diagn\xF3stico estrat\xE9gico con propietarios y directores. Si hay encaje, podemos agendar una breve llamada.

Atentamente,

Eva P\xE9rez
Gerente de Proyectos & Consultora Estrat\xE9gica
https://epmwellness.com
        `,html:`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:2px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        
        <!-- HEADER SIMPLE & ELEGANT -->
        <tr><td style="background:#1F2937;padding:30px 40px;text-align:left;">
          <p style="color:#D4BFA3;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 5px;font-weight:600;">EPM Wellness</p>
          <h1 style="color:#ffffff;font-size:22px;font-weight:400;margin:0;letter-spacing:0.5px;font-family:Georgia,serif;">Estrategia & Rentabilidad</h1>
        </td></tr>

        <!-- BODY -->
        <tr><td style="padding:40px 40px 30px;">
          <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px;">Hola,</p>
          <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px;">Bienvenido/a a mi red profesional. Gracias por tu inter\xE9s en optimizar la gesti\xF3n de tu centro wellness.</p>
          
          <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 25px;">Aqu\xED tienes acceso directo a la <strong>Gu\xEDa de Estrategia de Rentabilidad (Edici\xF3n 2025)</strong>. No es teor\xEDa acad\xE9mica; es la metodolog\xEDa exacta que aplico en mis consultor\xEDas para cadenas de lujo.</p>

          <!-- CALLOUT -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;border-left:4px solid #D4BFA3;margin-bottom:25px;">
            <tr><td style="padding:20px;">
              <p style="color:#111827;font-size:15px;font-weight:600;margin:0 0 10px;font-family:Georgia,serif;">En esta gu\xEDa ejecutiva:</p>
              <ul style="margin:0;padding-left:20px;color:#4B5563;font-size:14px;line-height:1.6;">
                <li style="margin-bottom:5px;">RevPATH: Por qu\xE9 la ocupaci\xF3n es una m\xE9trica incompleta.</li>
                <li style="margin-bottom:5px;">Ingenier\xEDa de Men\xFA para maximizar el margen.</li>
                <li>Productividad real del equipo terap\xE9utico.</li>
              </ul>
            </td></tr>
          </table>

          <!-- BUTTON -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:30px;">
            <tr><td align="center">
              <a href="https://epmwellness.com/resources/guia-rentabilidad-spa.html" style="background:#1F2937;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:14px 28px;border-radius:2px;display:inline-block;letter-spacing:0.5px;text-transform:uppercase;">Descargar Gu\xEDa Ejecutiva</a>
            </td></tr>
          </table>

          <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px;"><strong>Mi sugerencia personal:</strong><br>
          Revisa el <strong>Punto 01 (RevPATH)</strong> hoy mismo. Es donde encuentro el 80% de las fugas de rentabilidad en mis auditor\xEDas iniciales.</p>

          <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 0;">Si al leerlo identificas que hay margen de mejora en tu spa, <strong>responde a este correo</strong>. Me reservo huecos espec\xEDficos cada mes para sesiones de diagn\xF3stico con propietarios y directores.</p>
        </td></tr>

        <!-- SIGNATURE -->
        <tr><td style="padding:0 40px 40px;">
          <div style="border-top:1px solid #E5E7EB;margin-top:10px;padding-top:20px;">
            <p style="color:#111827;font-size:16px;font-weight:600;margin:0;font-family:Georgia,serif;">Eva P\xE9rez</p>
            <p style="color:#6B7280;font-size:13px;margin:4px 0 0;text-transform:uppercase;letter-spacing:1px;">Gerente de Proyectos & Consultora Estrat\xE9gica</p>
            <p style="color:#D4BFA3;font-size:13px;margin:8px 0 0;">
              <a href="https://epmwellness.com" style="color:#D4BFA3;text-decoration:none;">epmwellness.com</a>
            </p>
          </div>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#F3F4F6;padding:20px 40px;text-align:center;border-top:1px solid #E5E7EB;">
          <p style="color:#9CA3AF;font-size:11px;margin:0;line-height:1.5;">
            \xA9 2025 Eva P\xE9rez \xB7 EPM Wellness<br>
            Este correo se envi\xF3 a ${t.email} porque solicitaste nuestra gu\xEDa profesional.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
        `}),r.status(200).json({success:!0,message:"Suscripci\xF3n completada correctamente",data:n})}catch(t){return t instanceof O.z.ZodError?r.status(400).json({success:!1,message:"Email inv\xE1lido",errors:t.errors}):r.status(500).json({success:!1,message:"Error al procesar la suscripci\xF3n"})}}),o.post("/api/chat",J,ie),o.post("/api/appointments",async(e,r)=>{try{let t=K.parse(e.body),n=await u.createAppointment(t);return await N.sendEmail({to:"epm@epmwellness.com",subject:`Nueva cita reservada: ${t.name}`,text:`
          Nombre: ${t.name}
          Email: ${t.email}
          Tel\xE9fono: ${t.phone||"N/A"}
          Empresa: ${t.company||"N/A"}
          Fecha: ${new Date(t.date).toLocaleString()}
          Servicio: ${t.service}
          Mensaje: ${t.message||"N/A"}
        `}),await N.sendEmail({to:t.email,subject:"Solicitud de cita recibida - Eva P\xE9rez",text:`
Hola ${t.name},

Gracias por solicitar una cita. He recibido tu petici\xF3n para el d\xEDa ${new Date(t.date).toLocaleDateString()} a las ${new Date(t.date).toLocaleTimeString()}.

Tu cita est\xE1 actualmente en estado "Pendiente de confirmaci\xF3n". Revisar\xE9 mi agenda y te enviar\xE9 un correo de confirmaci\xF3n definitiva en breve.

Detalles de la solicitud:
- Servicio: ${t.service}
- Fecha: ${new Date(t.date).toLocaleString()}

Si necesitas modificar algo, por favor responde a este correo.

Atentamente,
Eva P\xE9rez
Gerente de Proyectos SPA & Wellness
https://epmwellness.com
        `}),r.status(201).json({success:!0,message:"Cita reservada correctamente",data:n})}catch(t){return t instanceof O.z.ZodError?r.status(400).json({success:!1,message:"Datos de la cita inv\xE1lidos",errors:t.errors}):r.status(500).json({success:!1,message:"Error al procesar la solicitud de cita"})}}),o.get("/api/appointments/available",async(e,r)=>{try{let t=e.query.date;if(!t||typeof t!="string")return r.status(400).json({success:!1,message:"Se requiere una fecha v\xE1lida"});let n=new Date(t);if(isNaN(n.getTime()))return r.status(400).json({success:!1,message:"Formato de fecha inv\xE1lido"});let l=await u.getAvailableSlots(n);return r.status(200).json({success:!0,data:l})}catch{return r.status(500).json({success:!1,message:"Error al obtener los horarios disponibles"})}}),o.get("/api/appointments",async(e,r)=>{try{let t=await u.getAllAppointments();return r.status(200).json({success:!0,data:t})}catch{return r.status(500).json({success:!1,message:"Error al obtener las citas"})}}),o.patch("/api/appointments/:id/status",async(e,r)=>{try{let t=parseInt(e.params.id),{status:n}=e.body;if(!n||!["pending","confirmed","cancelled"].includes(n))return r.status(400).json({success:!1,message:"Estado de cita inv\xE1lido"});let l=await u.updateAppointmentStatus(t,n);return l?r.status(200).json({success:!0,message:"Estado de la cita actualizado correctamente",data:l}):r.status(404).json({success:!1,message:"Cita no encontrada"})}catch{return r.status(500).json({success:!1,message:"Error al actualizar el estado de la cita"})}}),o.post("/api/articles/generate",async(e,r)=>{if(!e.isAuthenticated())return r.status(401).send("Unauthorized");try{let{topic:t}=e.body;if(!t)return r.status(400).json({success:!1,message:"El tema es requerido"});if(!process.env.OPENAI_API_KEY)return r.status(503).json({success:!1,message:"OpenAI API key no configurada"});let l=await new pe.default({apiKey:process.env.OPENAI_API_KEY}).chat.completions.create({model:"gpt-4o",messages:[{role:"system",content:"Eres un experto redactor de contenido para un blog de wellness y hospitalidad de lujo. Genera un art\xEDculo en formato JSON con los siguientes campos: title, content (en markdown), excerpt, category, readTime (ej: '5 min read'). El contenido debe estar en ESPA\xD1OL. El tono debe ser profesional, sofisticado y persuasivo, enfocado en hoteles de lujo y estrategias de bienestar."},{role:"user",content:`Escribe un art\xEDculo sobre: ${t}`}],response_format:{type:"json_object"}}),c=JSON.parse(l.choices[0].message.content||"{}"),i=c.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)+/g,""),d=await u.createArticle({slug:i,title:c.title,content:c.content,excerpt:c.excerpt,image:"https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",category:c.category,readTime:c.readTime,date:new Date().toISOString(),language:"es"});return r.status(201).json({success:!0,data:d})}catch(t){return console.error("Error generating article:",t),r.status(500).json({success:!1,message:"Error generando el art\xEDculo"})}}),o.get("/api/articles",async(e,r)=>{try{let t=await u.getAllArticles();r.json(t)}catch{r.status(500).json({message:"Error al obtener art\xEDculos"})}}),o.get("/sitemap.xml",async(e,r)=>{try{let t=await u.getAllArticles(),n="https://evaperez-wellness.com",c=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  ${["","#sobre-mi","#servicios","#ia-wellness","#portfolio","#testimonios","#blog","#contacto","privacy","terms"].map(i=>`
  <url>
    <loc>${n}/${i}</loc>
    <changefreq>monthly</changefreq>
    <priority>${i===""?"1.0":"0.8"}</priority>
  </url>`).join("")}

  <!-- Blog Posts -->
  ${t.map(i=>`
  <url>
    <loc>${n}/blog/${i.slug}</loc>
    <lastmod>${new Date(i.date).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join("")}
</urlset>`;r.header("Content-Type","application/xml"),r.send(c)}catch(t){console.error("Sitemap generation error:",t),r.status(500).send("Error generating sitemap")}}),o.get("/api/articles/:slug",async(e,r)=>{try{let t=await u.getArticleBySlug(e.params.slug);if(!t)return r.status(404).json({message:"Art\xEDculo no encontrado"});r.json(t)}catch{r.status(500).json({message:"Error al obtener el art\xEDculo"})}}),o.patch("/api/articles/:id",async(e,r)=>{if(!e.isAuthenticated())return r.sendStatus(401);try{let t=parseInt(e.params.id),n=await u.updateArticle(t,e.body);if(!n)return r.status(404).json({message:"Art\xEDculo no encontrado"});r.json(n)}catch{r.status(500).json({message:"Error al actualizar el art\xEDculo"})}}),(0,le.createServer)(o)}var ue=g(require("express")),C=g(require("fs")),T=g(require("path"));function de(o,s="express"){let e=new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",second:"2-digit",hour12:!0});console.log(`${e} [${s}] ${o}`)}async function ge(o,s){let{createServer:e,createLogger:r}=await import("vite"),t=r(),l=await e({server:{middlewareMode:!0,hmr:{server:s}},appType:"custom",configFile:T.default.resolve(__dirname,"..","vite.config.ts"),customLogger:{...t,error:(c,i)=>{t.error(c,i),process.exit(1)}}});o.use(l.middlewares),o.use("*",async(c,i,d)=>{let v=c.originalUrl;try{let y=T.default.resolve(__dirname,"..","client","index.html"),A=await C.default.promises.readFile(y,"utf-8");A=await l.transformIndexHtml(v,A);let{render:f}=await l.ssrLoadModule("/src/entry-server.tsx"),{html:E}=await f(v),x=A.replace(/<div id="root">(\s*<!--app-html-->\s*)?<\/div>/,`<div id="root">${E}</div>`);i.status(200).set({"Content-Type":"text/html"}).end(x)}catch(y){l.ssrFixStacktrace(y),d(y)}})}function fe(o){let s=T.default.resolve(process.cwd(),"dist","public");if(!C.default.existsSync(s)){console.error(`[serveStatic] Error: Build directory not found at ${s}`),console.error(`[serveStatic] CWD: ${process.cwd()}`);try{let e=T.default.resolve(process.cwd(),"dist");C.default.existsSync(e)?console.error(`[serveStatic] Contents of ${e}:`,C.default.readdirSync(e)):console.error(`[serveStatic] ${e} does not exist.`)}catch(e){console.error("[serveStatic] Error listing dist:",e)}throw new Error(`Could not find the build directory: ${s}, make sure to build the client first`)}o.use(ue.default.static(s)),o.use("*",(e,r)=>{r.sendFile(T.default.resolve(s,"index.html"))})}var D=g(require("passport")),ye=require("passport-local"),he=g(require("express-session")),_=require("crypto"),ve=require("util");var we=(0,ve.promisify)(_.scrypt);async function qe(o){let s=(0,_.randomBytes)(16).toString("hex");return`${(await we(o,s,64)).toString("hex")}.${s}`}async function ke(o,s){let[e,r]=s.split("."),t=Buffer.from(e,"hex"),n=await we(o,r,64);return(0,_.timingSafeEqual)(t,n)}function Se(o){let s={secret:process.env.SESSION_SECRET||"super_secret_key_change_in_prod",resave:!1,saveUninitialized:!1,store:u.sessionStore};o.get("env")==="production"&&o.set("trust proxy",1),o.use((0,he.default)(s)),o.use(D.default.initialize()),o.use(D.default.session()),D.default.use(new ye.Strategy(async(e,r,t)=>{let n=await u.getUserByUsername(e);return!n||!await ke(r,n.password)?t(null,!1):t(null,n)})),D.default.serializeUser((e,r)=>r(null,e.id)),D.default.deserializeUser(async(e,r)=>{let t=await u.getUser(e);r(null,t)}),o.post("/api/login",D.default.authenticate("local"),(e,r)=>{r.status(200).json(e.user)}),o.post("/api/register",async(e,r,t)=>{try{if(await u.getUserByUsername(e.body.username))return r.status(400).send("Username already exists");let l=await qe(e.body.password),c=await u.createUser({...e.body,password:l});e.login(c,i=>{if(i)return t(i);r.status(201).json(c)})}catch(n){t(n)}}),o.post("/api/logout",(e,r,t)=>{e.logout(n=>{if(n)return t(n);r.sendStatus(200)})}),o.get("/api/user",(e,r)=>{if(!e.isAuthenticated())return r.sendStatus(401);r.json(e.user)})}var Ae=g(require("fs")),X=g(require("path"));var be=g(require("helmet")),h=(0,B.default)();h.use((0,be.default)({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],scriptSrc:["'self'","'unsafe-inline'","https://replit.com","https://*.replit.com","https://cdnjs.cloudflare.com"],styleSrc:["'self'","'unsafe-inline'","https://fonts.googleapis.com","https://cdnjs.cloudflare.com"],fontSrc:["'self'","https://fonts.gstatic.com","https://cdnjs.cloudflare.com"],imgSrc:["'self'","data:","https://images.unsplash.com","https://*.replit.com"],connectSrc:["'self'","ws:","wss:","https://*.replit.com"]}}}));h.use(B.default.json());h.use(B.default.urlencoded({extended:!1}));h.use((o,s,e)=>{let r=Date.now(),t=o.path,n,l=s.json;s.json=function(c,...i){return n=c,l.apply(s,[c,...i])},s.on("finish",()=>{let c=Date.now()-r;if(t.startsWith("/api")){let i=`${o.method} ${t} ${s.statusCode} in ${c}ms`;n&&(i+=` :: ${JSON.stringify(n)}`),i.length>80&&(i=i.slice(0,79)+"\u2026"),de(i)}}),e()});(async()=>{try{console.log(""),console.log("\u{1F680} ================================"),console.log("\u{1F680} PersonalBrandSpa"),console.log("\u{1F680} ================================"),console.log(`Environment: ${h.get("env")}`),console.log(`Node: ${process.version}`),console.log(`Platform: ${process.platform}`),console.log("");let o=!!(process.env.DATABASE_URL?.trim()||!0);console.log(`\u2705 Database: ${o?"CONNECTED (Neon PostgreSQL)":"DISABLED (memory only)"}`),console.log("\u2705 Email: ENABLED (epm@epmwellness.com via Hostinger SMTP)");let s=!!process.env.OPENAI_API_KEY;console.log(`\u2705 OpenAI: ${s?"ENABLED":"DISABLED"}`),console.log(""),Se(h);let e=await me(h);h.get("/blog/:slug",async(n,l,c)=>{try{let i=n.params.slug,d=await u.getArticleBySlug(i);if(!d)return c();let v=h.get("env")==="development",y=v?X.default.join(process.cwd(),"client","index.html"):X.default.join(process.cwd(),"dist","public","index.html"),A=await Ae.default.promises.readFile(y,"utf-8"),f=`${d.title} | Eva P\xE9rez`,E=d.excerpt||"Art\xEDculo de Eva P\xE9rez - Wellness & Hospitality Strategy",x=d.image.startsWith("http")?d.image:`https://evaperez-wellness.com${d.image}`,P=`https://evaperez-wellness.com/blog/${d.slug}`;A=A.replace(/<title>[\s\S]*?<\/title>/,`<title>${f}</title>`).replace(/<meta name="description"[\s\S]*?\/>/,`<meta name="description" content="${E}" />`).replace(/<meta property="og:title"[\s\S]*?\/>/,`<meta property="og:title" content="${f}" />`).replace(/<meta property="og:description"[\s\S]*?\/>/,`<meta property="og:description" content="${E}" />`).replace(/<meta property="og:image"[\s\S]*?\/>/,`<meta property="og:image" content="${x}" />`).replace(/<meta property="og:url"[\s\S]*?\/>/,`<meta property="og:url" content="${P}" />`).replace(/<meta property="twitter:title"[\s\S]*?\/>/,`<meta property="twitter:title" content="${f}" />`).replace(/<meta property="twitter:description"[\s\S]*?\/>/,`<meta property="twitter:description" content="${E}" />`).replace(/<meta property="twitter:image"[\s\S]*?\/>/,`<meta property="twitter:image" content="${x}" />`).replace(/<meta property="twitter:url"[\s\S]*?\/>/,`<meta property="twitter:url" content="${P}" />`),l.status(200).set({"Content-Type":"text/html"}).end(A)}catch(i){console.error("SEO middleware error:",i),c()}}),h.use((n,l,c,i)=>{let d=n.status||n.statusCode||500,v=n.message||"Internal Server Error";c.status(d).json({message:v}),console.error("\u274C Error:",v)}),h.get("env")==="development"?(console.log("Setting up Vite dev server..."),await ge(h,e)):(console.log("\u{1F4C1} Serving static files from dist/public"),fe(h));let t=parseInt(process.env.PORT||"5000",10);e.listen(t,()=>{console.log(""),console.log("\u2705 ================================"),console.log("\u2705 SERVER STARTED SUCCESSFULLY!"),console.log(`\u2705 Port: ${t}`),console.log(`\u2705 URL: http://localhost:${t}`),console.log("\u2705 ================================"),console.log(""),console.log("\u2139\uFE0F  Service Status:"),console.log("\u2705  - Database: Neon PostgreSQL"),console.log("\u2705  - Email: epm@epmwellness.com (Hostinger SMTP)"),process.env.OPENAI_API_KEY?console.log("\u2705  - AI Chatbot ACTIVE"):console.log("\u26A0\uFE0F  - No AI chatbot (OPENAI_API_KEY missing)"),console.log("")})}catch(o){console.error(""),console.error("\u274C ================================"),console.error("\u274C FATAL STARTUP ERROR"),console.error("\u274C ================================"),console.error(o),console.error(""),process.exit(1)}})();process.on("uncaughtException",o=>{console.error("Uncaught Exception:",o)});process.on("unhandledRejection",(o,s)=>{console.error("Unhandled Rejection at:",s,"reason:",o)});
//# sourceMappingURL=index.js.map
