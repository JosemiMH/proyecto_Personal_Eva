import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect } from "react";
import { Check, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { c as cn, j as buttonVariants, u as useLanguage, C as Card, k as CardHeader, l as CardTitle, m as CardDescription, n as CardContent, o as CardFooter, B as Button, i as apiRequest, q as toast } from "../entry-server.js";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, I as Input, e as FormMessage, f as FormDescription } from "./input-C7RySMSg.js";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addDays, format, isBefore } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      CheckboxPrimitive.Indicator,
      {
        className: cn("flex items-center justify-center text-current"),
        children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" })
      }
    )
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn("p-3", className),
      classNames: {
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames
      },
      components: {
        IconLeft: ({ ...props2 }) => /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
        IconRight: ({ ...props2 }) => /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
      },
      ...props
    }
  );
}
Calendar.displayName = "Calendar";
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
const serviceOptions = [
  { value: "consultoria", label: { es: "Consultoría estratégica", en: "Strategic consulting" } },
  { value: "interim", label: { es: "Dirección interina", en: "Interim management" } },
  { value: "formacion", label: { es: "Formación especializada", en: "Specialized training" } },
  { value: "proyecto", label: { es: "Gestión de proyectos", en: "Project management" } }
];
const BookingCalendar = () => {
  const { language, t } = useLanguage();
  const [date, setDate] = useState(void 0);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [step, setStep] = useState("date");
  const dateLocale = language === "es" ? es : enUS;
  const formSchema = z.object({
    name: z.string().min(2, {
      message: t("booking.val.name")
    }),
    email: z.string().email({
      message: t("booking.val.email")
    }),
    phone: z.string().optional(),
    company: z.string().optional(),
    service: z.string({
      required_error: t("booking.val.service")
    }),
    message: z.string().optional(),
    privacy: z.boolean().refine((val) => val === true, {
      message: t("booking.val.privacy")
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      message: "",
      privacy: false
    }
  });
  useEffect(() => {
    if (!date) return;
    const fetchAvailableSlots = async () => {
      setIsLoading(true);
      try {
        const result = await apiRequest({
          path: `/api/appointments/available?date=${date.toISOString()}`,
          method: "GET"
        });
        if (result.success && result.data) {
          const formattedSlots = result.data.map((slot) => ({
            start: new Date(slot.start),
            end: new Date(slot.end)
          }));
          setAvailableSlots(formattedSlots);
          setStep("time");
        } else {
          toast({
            title: t("booking.fetchError"),
            description: t("booking.fetchError"),
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching available slots:", error);
        toast({
          title: t("booking.fetchError"),
          description: t("booking.fetchError"),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailableSlots();
  }, [date, language, t]);
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep("form");
  };
  const onSubmit = async (values) => {
    if (!selectedSlot || !date) return;
    setSubmitLoading(true);
    try {
      const appointmentData = {
        ...values,
        date: selectedSlot.start,
        duration: 60,
        status: "pending"
      };
      const result = await apiRequest({
        path: "/api/appointments",
        method: "POST",
        body: appointmentData
      });
      if (result.success) {
        toast({
          title: t("booking.successTitle"),
          description: t("booking.successDesc")
        });
        form.reset();
        setDate(void 0);
        setSelectedSlot(null);
        setStep("date");
      } else {
        toast({
          title: t("booking.errorTitle"),
          description: t("booking.errorDesc"),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: t("booking.errorTitle"),
        description: t("booking.errorDesc"),
        variant: "destructive"
      });
    } finally {
      setSubmitLoading(false);
    }
  };
  const handleBackClick = () => {
    if (step === "time") {
      setStep("date");
    } else if (step === "form") {
      setStep("time");
    }
  };
  const isDateUnavailable = (date2) => {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    if (isBefore(date2, today)) {
      return true;
    }
    const day = date2.getDay();
    return day === 0 || day === 6;
  };
  return /* @__PURE__ */ jsx("div", { className: "w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: t("booking.title") }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: t("booking.subtitle") }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-6", children: /* @__PURE__ */ jsx("div", { className: "md:col-span-12", children: /* @__PURE__ */ jsxs(AnimatePresence, { mode: "wait", children: [
      step === "date" && /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          transition: { duration: 0.3 },
          children: /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: t("booking.selectDate") }),
              /* @__PURE__ */ jsx(CardDescription, { children: t("booking.chooseDay") })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(
              Calendar,
              {
                mode: "single",
                selected: date,
                onSelect: setDate,
                disabled: isDateUnavailable,
                locale: dateLocale,
                className: "rounded-md border",
                fromDate: /* @__PURE__ */ new Date(),
                toDate: addDays(/* @__PURE__ */ new Date(), 60)
              }
            ) }),
            /* @__PURE__ */ jsx(CardFooter, { className: "flex flex-col gap-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: t("booking.weekendUnavailable") }) })
          ] })
        },
        "date-step"
      ),
      step === "time" && /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          transition: { duration: 0.3 },
          children: /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: t("booking.selectTime") }),
              /* @__PURE__ */ jsxs(CardDescription, { children: [
                t("booking.availableTimes"),
                " ",
                format(date, "PPP", { locale: dateLocale })
              ] })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-turquoise" }) }) : availableSlots.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3", children: availableSlots.map((slot, index) => /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                className: "hover:bg-turquoise/10",
                onClick: () => handleSlotSelect(slot),
                children: format(slot.start, "HH:mm")
              },
              index
            )) }) : /* @__PURE__ */ jsx("div", { className: "text-center py-6", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: t("booking.noSlots") }) }) }),
            /* @__PURE__ */ jsx(CardFooter, { className: "flex justify-between", children: /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                onClick: handleBackClick,
                children: t("booking.back")
              }
            ) })
          ] })
        },
        "time-step"
      ),
      step === "form" && selectedSlot && /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          transition: { duration: 0.3 },
          children: /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: t("booking.complete") }),
              /* @__PURE__ */ jsxs(CardDescription, { children: [
                t("booking.details"),
                " ",
                format(date, "PPP", { locale: dateLocale }),
                " ",
                t("booking.at"),
                " ",
                format(selectedSlot.start, "HH:mm")
              ] })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "name",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                      /* @__PURE__ */ jsx(FormLabel, { children: t("booking.fullName") }),
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: String(t("booking.namePlaceholder")), ...field }) }),
                      /* @__PURE__ */ jsx(FormMessage, {})
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "email",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                      /* @__PURE__ */ jsx(FormLabel, { children: t("booking.email") }),
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: String(t("booking.emailPlaceholder")), type: "email", ...field }) }),
                      /* @__PURE__ */ jsx(FormMessage, {})
                    ] })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "phone",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                      /* @__PURE__ */ jsx(FormLabel, { children: t("booking.phone") }),
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: String(t("booking.phonePlaceholder")), ...field }) }),
                      /* @__PURE__ */ jsx(FormMessage, {})
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "company",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                      /* @__PURE__ */ jsx(FormLabel, { children: t("booking.company") }),
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: String(t("booking.companyPlaceholder")), ...field }) }),
                      /* @__PURE__ */ jsx(FormMessage, {})
                    ] })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "service",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                    /* @__PURE__ */ jsx(FormLabel, { children: t("booking.service") }),
                    /* @__PURE__ */ jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("booking.selectService") }) }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: serviceOptions.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option.value, children: option.label[language] }, option.value)) })
                    ] }),
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
                    /* @__PURE__ */ jsx(FormLabel, { children: t("booking.message") }),
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                      Textarea,
                      {
                        placeholder: String(t("booking.messagePlaceholder")),
                        className: "resize-none",
                        ...field
                      }
                    ) }),
                    /* @__PURE__ */ jsx(FormMessage, {})
                  ] })
                }
              ),
              /* @__PURE__ */ jsx(Separator, { className: "my-4" }),
              /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "privacy",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-row items-start space-x-3 space-y-0", children: [
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                      Checkbox,
                      {
                        checked: field.value,
                        onCheckedChange: field.onChange
                      }
                    ) }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-1 leading-none", children: [
                      /* @__PURE__ */ jsx(FormLabel, { children: t("booking.privacy") }),
                      /* @__PURE__ */ jsx(FormDescription, { children: t("booking.privacyDesc") })
                    ] }),
                    /* @__PURE__ */ jsx(FormMessage, {})
                  ] })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-4", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: handleBackClick,
                    children: t("booking.back")
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "submit",
                    className: "bg-turquoise hover:bg-turquoise/90",
                    disabled: submitLoading,
                    children: submitLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { className: "animate-spin mr-2", children: "⏳" }),
                      t("booking.sending")
                    ] }) : t("booking.confirm")
                  }
                ) })
              ] })
            ] }) }) })
          ] })
        },
        "form-step"
      )
    ] }) }) })
  ] }) });
};
export {
  BookingCalendar as B,
  Checkbox as C,
  Select as S,
  Textarea as T,
  SelectTrigger as a,
  SelectValue as b,
  SelectContent as c,
  SelectItem as d
};
