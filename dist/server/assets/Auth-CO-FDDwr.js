import { jsx, jsxs } from "react/jsx-runtime";
import { r as useAuth, C as Card, k as CardHeader, l as CardTitle, m as CardDescription, n as CardContent, B as Button } from "../entry-server.js";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, I as Input, e as FormMessage } from "./input-C7RySMSg.js";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import "react-dom/server";
import "@tanstack/react-query";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "framer-motion";
import "react-markdown";
import "@radix-ui/react-dialog";
import "@radix-ui/react-slot";
import "react-icons/fa";
import "react-helmet-async";
import "@radix-ui/react-label";
const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});
function AuthPage() {
  const { user, loginMutation } = useAuth();
  const [, setLocation] = useLocation();
  useEffect(() => {
    if (user) {
      setLocation("/admin");
    }
  }, [user, setLocation]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });
  function onSubmit(values) {
    loginMutation.mutate(values);
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 px-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold text-center", children: "Admin Login" }),
      /* @__PURE__ */ jsx(CardDescription, { className: "text-center", children: "Enter your credentials to access the admin panel" })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "username",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Username" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { ...field }) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "password",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Password" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "password", ...field }) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "submit",
          className: "w-full bg-turquoise hover:bg-turquoise-dark",
          disabled: loginMutation.isPending,
          children: [
            loginMutation.isPending && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Sign In"
          ]
        }
      )
    ] }) }) })
  ] }) });
}
export {
  AuthPage as default
};
