import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { u as useLanguage, f as useToast, h as trackEvent, g as apiRequest, D as Dialog, v as DialogTrigger, a as DialogContent, w as DialogHeader, b as DialogTitle, c as DialogDescription, B as Button, d as cn } from "../entry-server.mjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, I as Input, e as FormMessage } from "./input-CpzPiKMZ.mjs";
import { T as Textarea } from "./textarea-CYyNOJWu.mjs";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
function AuditModal({ children, source = "unknown" }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const formSchema = z.object({
    name: z.string().min(2, "Name required"),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    company: z.string().min(2, "Company required"),
    // Using company field for Hotel/Spa name
    message: z.string().min(5, "Challenge details required"),
    // Using message for Challenge
    service: z.string().default("Auditoría Estratégica"),
    privacy: z.literal(true)
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
      service: "Auditoría Estratégica",
      privacy: true
    }
  });
  const mutation = useMutation({
    mutationFn: async (values) => {
      const res = await apiRequest({
        method: "POST",
        path: "/api/contact",
        body: values
      });
      return res;
    },
    onSuccess: () => {
      trackEvent("generate_lead", { lead_type: "strategic_audit" });
      toast({
        title: t("audit.success"),
        variant: "default"
      });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      let errorMessage = "Something went wrong. Please try again.";
      if (error.message) {
        const jsonStart = error.message.indexOf("{");
        if (jsonStart !== -1) {
          try {
            const jsonStr = error.message.substring(jsonStart);
            const data = JSON.parse(jsonStr);
            if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
              errorMessage = data.errors[0].message;
            } else if (data.message) {
              errorMessage = data.message;
            }
          } catch (e) {
            errorMessage = error.message;
          }
        } else {
          errorMessage = error.message;
        }
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });
  function onSubmit(values) {
    mutation.mutate(values);
  }
  const handleOpenChange = (nextOpen) => {
    if (nextOpen && !open) {
      trackEvent("cta_click", {
        cta_name: "strategic_audit",
        cta_location: source
      });
    }
    setOpen(nextOpen);
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: handleOpenChange, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px] max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: t("audit.title") }),
        /* @__PURE__ */ jsx(DialogDescription, { children: t("audit.description") })
      ] }),
      /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "name",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: t("audit.name") }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Eva Pérez", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "email",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: t("audit.email") }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "eva@example.com", ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "phone",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: t("audit.phone") }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "+34 600...", ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "company",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: t("audit.hotel") }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Grand Hotel & Spa...", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "message",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: t("audit.challenge") }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Textarea,
                {
                  placeholder: t("audit.subtitle"),
                  className: "resize-none",
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxs(Button, { type: "submit", className: "w-full bg-turquoise hover:bg-turquoise-dark text-white", disabled: mutation.isPending, children: [
          mutation.isPending && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
          t("audit.submit")
        ] })
      ] }) })
    ] })
  ] });
}
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-muted", className),
      ...props
    }
  );
}
export {
  AuditModal as A,
  Skeleton as S
};
