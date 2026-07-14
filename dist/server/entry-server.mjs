var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a, _b;
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "node:stream";
import { useLocation, Link, Route, Redirect, Switch, Router as Router$1, useRoute } from "wouter";
import { QueryClient, useQuery, useMutation, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import React__default, { Component, createContext, useContext, useState, useEffect, useRef, Suspense, useMemo } from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X, AlertCircle, Loader2, ArrowRight, Tag, Check, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, ArrowLeft, Calendar as Calendar$1, Clock } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { FormProvider, Controller, useFormContext, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { FaArrowUp, FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { DayPicker } from "react-day-picker";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { addDays, format, isBefore } from "date-fns";
import { es, enUS } from "date-fns/locale";
import fastCompare from "react-fast-compare";
import invariant from "invariant";
import shallowEqual from "shallowequal";
import { Slot } from "@radix-ui/react-slot";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as LabelPrimitive from "@radix-ui/react-label";
async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = await res.text() || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}
async function apiRequest({
  path,
  method = "GET",
  body = void 0
}) {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : void 0,
    credentials: "include"
  });
  await throwIfResNotOk(res);
  if (res.status === 204) {
    return void 0;
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await res.json();
  }
  const text = await res.text();
  return text || void 0;
}
const getQueryFn = ({ on401: unauthorizedBehavior }) => async ({ queryKey }) => {
  const res = await fetch(queryKey[0], {
    credentials: "include"
  });
  if (unauthorizedBehavior === "returnNull" && res.status === 401) {
    return null;
  }
  await throwIfResNotOk(res);
  return await res.json();
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false
    },
    mutations: {
      retry: false
    }
  }
});
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e6;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Root,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Title,
  {
    ref,
    className: cn("text-sm font-semibold", className),
    ...props
  }
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Description,
  {
    ref,
    className: cn("text-sm opacity-90", className),
    ...props
  }
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
function Toaster() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
var TAG_NAMES = /* @__PURE__ */ ((TAG_NAMES2) => {
  TAG_NAMES2["BASE"] = "base";
  TAG_NAMES2["BODY"] = "body";
  TAG_NAMES2["HEAD"] = "head";
  TAG_NAMES2["HTML"] = "html";
  TAG_NAMES2["LINK"] = "link";
  TAG_NAMES2["META"] = "meta";
  TAG_NAMES2["NOSCRIPT"] = "noscript";
  TAG_NAMES2["SCRIPT"] = "script";
  TAG_NAMES2["STYLE"] = "style";
  TAG_NAMES2["TITLE"] = "title";
  TAG_NAMES2["FRAGMENT"] = "Symbol(react.fragment)";
  return TAG_NAMES2;
})(TAG_NAMES || {});
var SEO_PRIORITY_TAGS = {
  link: { rel: ["amphtml", "canonical", "alternate"] },
  script: { type: ["application/ld+json"] },
  meta: {
    charset: "",
    name: ["generator", "robots", "description"],
    property: [
      "og:type",
      "og:title",
      "og:url",
      "og:image",
      "og:image:alt",
      "og:description",
      "twitter:url",
      "twitter:title",
      "twitter:description",
      "twitter:image",
      "twitter:image:alt",
      "twitter:card",
      "twitter:site"
    ]
  }
};
var VALID_TAG_NAMES = Object.values(TAG_NAMES);
var REACT_TAG_MAP = {
  accesskey: "accessKey",
  charset: "charSet",
  class: "className",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  "http-equiv": "httpEquiv",
  itemprop: "itemProp",
  tabindex: "tabIndex"
};
var HTML_TAG_MAP = Object.entries(REACT_TAG_MAP).reduce(
  (carry, [key, value]) => {
    carry[value] = key;
    return carry;
  },
  {}
);
var HELMET_ATTRIBUTE = "data-rh";
var HELMET_PROPS = {
  DEFAULT_TITLE: "defaultTitle",
  DEFER: "defer",
  ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
  ON_CHANGE_CLIENT_STATE: "onChangeClientState",
  TITLE_TEMPLATE: "titleTemplate",
  PRIORITIZE_SEO_TAGS: "prioritizeSeoTags"
};
var getInnermostProperty = (propsList, property) => {
  for (let i = propsList.length - 1; i >= 0; i -= 1) {
    const props = propsList[i];
    if (Object.prototype.hasOwnProperty.call(props, property)) {
      return props[property];
    }
  }
  return null;
};
var getTitleFromPropsList = (propsList) => {
  let innermostTitle = getInnermostProperty(
    propsList,
    "title"
    /* TITLE */
  );
  const innermostTemplate = getInnermostProperty(propsList, HELMET_PROPS.TITLE_TEMPLATE);
  if (Array.isArray(innermostTitle)) {
    innermostTitle = innermostTitle.join("");
  }
  if (innermostTemplate && innermostTitle) {
    return innermostTemplate.replace(/%s/g, () => innermostTitle);
  }
  const innermostDefaultTitle = getInnermostProperty(propsList, HELMET_PROPS.DEFAULT_TITLE);
  return innermostTitle || innermostDefaultTitle || void 0;
};
var getOnChangeClientState = (propsList) => getInnermostProperty(propsList, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || (() => {
});
var getAttributesFromPropsList = (tagType, propsList) => propsList.filter((props) => typeof props[tagType] !== "undefined").map((props) => props[tagType]).reduce((tagAttrs, current) => ({ ...tagAttrs, ...current }), {});
var getBaseTagFromPropsList = (primaryAttributes, propsList) => propsList.filter((props) => typeof props[
  "base"
  /* BASE */
] !== "undefined").map((props) => props[
  "base"
  /* BASE */
]).reverse().reduce((innermostBaseTag, tag) => {
  if (!innermostBaseTag.length) {
    const keys = Object.keys(tag);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const lowerCaseAttributeKey = attributeKey.toLowerCase();
      if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && tag[lowerCaseAttributeKey]) {
        return innermostBaseTag.concat(tag);
      }
    }
  }
  return innermostBaseTag;
}, []);
var warn = (msg) => console && typeof console.warn === "function" && console.warn(msg);
var getTagsFromPropsList = (tagName, primaryAttributes, propsList) => {
  const approvedSeenTags = {};
  return propsList.filter((props) => {
    if (Array.isArray(props[tagName])) {
      return true;
    }
    if (typeof props[tagName] !== "undefined") {
      warn(
        `Helmet: ${tagName} should be of type "Array". Instead found type "${typeof props[tagName]}"`
      );
    }
    return false;
  }).map((props) => props[tagName]).reverse().reduce((approvedTags, instanceTags) => {
    const instanceSeenTags = {};
    instanceTags.filter((tag) => {
      let primaryAttributeKey;
      const keys2 = Object.keys(tag);
      for (let i = 0; i < keys2.length; i += 1) {
        const attributeKey = keys2[i];
        const lowerCaseAttributeKey = attributeKey.toLowerCase();
        if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && !(primaryAttributeKey === "rel" && tag[primaryAttributeKey].toLowerCase() === "canonical") && !(lowerCaseAttributeKey === "rel" && tag[lowerCaseAttributeKey].toLowerCase() === "stylesheet")) {
          primaryAttributeKey = lowerCaseAttributeKey;
        }
        if (primaryAttributes.indexOf(attributeKey) !== -1 && (attributeKey === "innerHTML" || attributeKey === "cssText" || attributeKey === "itemprop")) {
          primaryAttributeKey = attributeKey;
        }
      }
      if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
        return false;
      }
      const value = tag[primaryAttributeKey].toLowerCase();
      if (!approvedSeenTags[primaryAttributeKey]) {
        approvedSeenTags[primaryAttributeKey] = {};
      }
      if (!instanceSeenTags[primaryAttributeKey]) {
        instanceSeenTags[primaryAttributeKey] = {};
      }
      if (!approvedSeenTags[primaryAttributeKey][value]) {
        instanceSeenTags[primaryAttributeKey][value] = true;
        return true;
      }
      return false;
    }).reverse().forEach((tag) => approvedTags.push(tag));
    const keys = Object.keys(instanceSeenTags);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const tagUnion = {
        ...approvedSeenTags[attributeKey],
        ...instanceSeenTags[attributeKey]
      };
      approvedSeenTags[attributeKey] = tagUnion;
    }
    return approvedTags;
  }, []).reverse();
};
var getAnyTrueFromPropsList = (propsList, checkedTag) => {
  if (Array.isArray(propsList) && propsList.length) {
    for (let index = 0; index < propsList.length; index += 1) {
      const prop = propsList[index];
      if (prop[checkedTag]) {
        return true;
      }
    }
  }
  return false;
};
var reducePropsToState = (propsList) => ({
  baseTag: getBaseTagFromPropsList([
    "href"
    /* HREF */
  ], propsList),
  bodyAttributes: getAttributesFromPropsList("bodyAttributes", propsList),
  defer: getInnermostProperty(propsList, HELMET_PROPS.DEFER),
  encode: getInnermostProperty(propsList, HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
  htmlAttributes: getAttributesFromPropsList("htmlAttributes", propsList),
  linkTags: getTagsFromPropsList(
    "link",
    [
      "rel",
      "href"
      /* HREF */
    ],
    propsList
  ),
  metaTags: getTagsFromPropsList(
    "meta",
    [
      "name",
      "charset",
      "http-equiv",
      "property",
      "itemprop"
      /* ITEM_PROP */
    ],
    propsList
  ),
  noscriptTags: getTagsFromPropsList("noscript", [
    "innerHTML"
    /* INNER_HTML */
  ], propsList),
  onChangeClientState: getOnChangeClientState(propsList),
  scriptTags: getTagsFromPropsList(
    "script",
    [
      "src",
      "innerHTML"
      /* INNER_HTML */
    ],
    propsList
  ),
  styleTags: getTagsFromPropsList("style", [
    "cssText"
    /* CSS_TEXT */
  ], propsList),
  title: getTitleFromPropsList(propsList),
  titleAttributes: getAttributesFromPropsList("titleAttributes", propsList),
  prioritizeSeoTags: getAnyTrueFromPropsList(propsList, HELMET_PROPS.PRIORITIZE_SEO_TAGS)
});
var flattenArray = (possibleArray) => Array.isArray(possibleArray) ? possibleArray.join("") : possibleArray;
var checkIfPropsMatch = (props, toMatch) => {
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i += 1) {
    if (toMatch[keys[i]] && toMatch[keys[i]].includes(props[keys[i]])) {
      return true;
    }
  }
  return false;
};
var prioritizer = (elementsList, propsToMatch) => {
  if (Array.isArray(elementsList)) {
    return elementsList.reduce(
      (acc, elementAttrs) => {
        if (checkIfPropsMatch(elementAttrs, propsToMatch)) {
          acc.priority.push(elementAttrs);
        } else {
          acc.default.push(elementAttrs);
        }
        return acc;
      },
      { priority: [], default: [] }
    );
  }
  return { default: elementsList, priority: [] };
};
var without = (obj, key) => {
  return {
    ...obj,
    [key]: void 0
  };
};
var SELF_CLOSING_TAGS = [
  "noscript",
  "script",
  "style"
  /* STYLE */
];
var encodeSpecialCharacters = (str, encode = true) => {
  if (encode === false) {
    return String(str);
  }
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
};
var generateElementAttributesAsString = (attributes) => Object.keys(attributes).reduce((str, key) => {
  const attr = typeof attributes[key] !== "undefined" ? `${key}="${attributes[key]}"` : `${key}`;
  return str ? `${str} ${attr}` : attr;
}, "");
var generateTitleAsString = (type, title, attributes, encode) => {
  const attributeString = generateElementAttributesAsString(attributes);
  const flattenedTitle = flattenArray(title);
  return attributeString ? `<${type} ${HELMET_ATTRIBUTE}="true" ${attributeString}>${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>` : `<${type} ${HELMET_ATTRIBUTE}="true">${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>`;
};
var generateTagsAsString = (type, tags, encode = true) => tags.reduce((str, t) => {
  const tag = t;
  const attributeHtml = Object.keys(tag).filter(
    (attribute) => !(attribute === "innerHTML" || attribute === "cssText")
  ).reduce((string, attribute) => {
    const attr = typeof tag[attribute] === "undefined" ? attribute : `${attribute}="${encodeSpecialCharacters(tag[attribute], encode)}"`;
    return string ? `${string} ${attr}` : attr;
  }, "");
  const tagContent = tag.innerHTML || tag.cssText || "";
  const isSelfClosing = SELF_CLOSING_TAGS.indexOf(type) === -1;
  return `${str}<${type} ${HELMET_ATTRIBUTE}="true" ${attributeHtml}${isSelfClosing ? `/>` : `>${tagContent}</${type}>`}`;
}, "");
var convertElementAttributesToReactProps = (attributes, initProps = {}) => Object.keys(attributes).reduce((obj, key) => {
  const mapped = REACT_TAG_MAP[key];
  obj[mapped || key] = attributes[key];
  return obj;
}, initProps);
var generateTitleAsReactComponent = (_type, title, attributes) => {
  const initProps = {
    key: title,
    [HELMET_ATTRIBUTE]: true
  };
  const props = convertElementAttributesToReactProps(attributes, initProps);
  return [React__default.createElement("title", props, title)];
};
var generateTagsAsReactComponent = (type, tags) => tags.map((tag, i) => {
  const mappedTag = {
    key: i,
    [HELMET_ATTRIBUTE]: true
  };
  Object.keys(tag).forEach((attribute) => {
    const mapped = REACT_TAG_MAP[attribute];
    const mappedAttribute = mapped || attribute;
    if (mappedAttribute === "innerHTML" || mappedAttribute === "cssText") {
      const content = tag.innerHTML || tag.cssText;
      mappedTag.dangerouslySetInnerHTML = { __html: content };
    } else {
      mappedTag[mappedAttribute] = tag[attribute];
    }
  });
  return React__default.createElement(type, mappedTag);
});
var getMethodsForTag = (type, tags, encode = true) => {
  switch (type) {
    case "title":
      return {
        toComponent: () => generateTitleAsReactComponent(type, tags.title, tags.titleAttributes),
        toString: () => generateTitleAsString(type, tags.title, tags.titleAttributes, encode)
      };
    case "bodyAttributes":
    case "htmlAttributes":
      return {
        toComponent: () => convertElementAttributesToReactProps(tags),
        toString: () => generateElementAttributesAsString(tags)
      };
    default:
      return {
        toComponent: () => generateTagsAsReactComponent(type, tags),
        toString: () => generateTagsAsString(type, tags, encode)
      };
  }
};
var getPriorityMethods = ({ metaTags, linkTags, scriptTags, encode }) => {
  const meta = prioritizer(metaTags, SEO_PRIORITY_TAGS.meta);
  const link = prioritizer(linkTags, SEO_PRIORITY_TAGS.link);
  const script = prioritizer(scriptTags, SEO_PRIORITY_TAGS.script);
  const priorityMethods = {
    toComponent: () => [
      ...generateTagsAsReactComponent("meta", meta.priority),
      ...generateTagsAsReactComponent("link", link.priority),
      ...generateTagsAsReactComponent("script", script.priority)
    ],
    toString: () => (
      // generate all the tags as strings and concatenate them
      `${getMethodsForTag("meta", meta.priority, encode)} ${getMethodsForTag(
        "link",
        link.priority,
        encode
      )} ${getMethodsForTag("script", script.priority, encode)}`
    )
  };
  return {
    priorityMethods,
    metaTags: meta.default,
    linkTags: link.default,
    scriptTags: script.default
  };
};
var mapStateOnServer = (props) => {
  const {
    baseTag,
    bodyAttributes,
    encode = true,
    htmlAttributes,
    noscriptTags,
    styleTags,
    title = "",
    titleAttributes,
    prioritizeSeoTags
  } = props;
  let { linkTags, metaTags, scriptTags } = props;
  let priorityMethods = {
    toComponent: () => {
    },
    toString: () => ""
  };
  if (prioritizeSeoTags) {
    ({ priorityMethods, linkTags, metaTags, scriptTags } = getPriorityMethods(props));
  }
  return {
    priority: priorityMethods,
    base: getMethodsForTag("base", baseTag, encode),
    bodyAttributes: getMethodsForTag("bodyAttributes", bodyAttributes, encode),
    htmlAttributes: getMethodsForTag("htmlAttributes", htmlAttributes, encode),
    link: getMethodsForTag("link", linkTags, encode),
    meta: getMethodsForTag("meta", metaTags, encode),
    noscript: getMethodsForTag("noscript", noscriptTags, encode),
    script: getMethodsForTag("script", scriptTags, encode),
    style: getMethodsForTag("style", styleTags, encode),
    title: getMethodsForTag("title", { title, titleAttributes }, encode)
  };
};
var server_default = mapStateOnServer;
var instances = [];
var isDocument = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var HelmetData = class {
  constructor(context, canUseDOM) {
    __publicField(this, "instances", []);
    __publicField(this, "canUseDOM", isDocument);
    __publicField(this, "context");
    __publicField(this, "value", {
      setHelmet: (serverState) => {
        this.context.helmet = serverState;
      },
      helmetInstances: {
        get: () => this.canUseDOM ? instances : this.instances,
        add: (instance) => {
          (this.canUseDOM ? instances : this.instances).push(instance);
        },
        remove: (instance) => {
          const index = (this.canUseDOM ? instances : this.instances).indexOf(instance);
          (this.canUseDOM ? instances : this.instances).splice(index, 1);
        }
      }
    });
    this.context = context;
    this.canUseDOM = canUseDOM || false;
    if (!canUseDOM) {
      context.helmet = server_default({
        baseTag: [],
        bodyAttributes: {},
        htmlAttributes: {},
        linkTags: [],
        metaTags: [],
        noscriptTags: [],
        scriptTags: [],
        styleTags: [],
        title: "",
        titleAttributes: {}
      });
    }
  }
};
var defaultValue$1 = {};
var Context = React__default.createContext(defaultValue$1);
var HelmetProvider = (_a = class extends Component {
  constructor(props) {
    super(props);
    __publicField(this, "helmetData");
    this.helmetData = new HelmetData(this.props.context || {}, _a.canUseDOM);
  }
  render() {
    return /* @__PURE__ */ React__default.createElement(Context.Provider, { value: this.helmetData.value }, this.props.children);
  }
}, __publicField(_a, "canUseDOM", isDocument), _a);
var updateTags = (type, tags) => {
  const headElement = document.head || document.querySelector(
    "head"
    /* HEAD */
  );
  const tagNodes = headElement.querySelectorAll(`${type}[${HELMET_ATTRIBUTE}]`);
  const oldTags = [].slice.call(tagNodes);
  const newTags = [];
  let indexToDelete;
  if (tags && tags.length) {
    tags.forEach((tag) => {
      const newElement = document.createElement(type);
      for (const attribute in tag) {
        if (Object.prototype.hasOwnProperty.call(tag, attribute)) {
          if (attribute === "innerHTML") {
            newElement.innerHTML = tag.innerHTML;
          } else if (attribute === "cssText") {
            if (newElement.styleSheet) {
              newElement.styleSheet.cssText = tag.cssText;
            } else {
              newElement.appendChild(document.createTextNode(tag.cssText));
            }
          } else {
            const attr = attribute;
            const value = typeof tag[attr] === "undefined" ? "" : tag[attr];
            newElement.setAttribute(attribute, value);
          }
        }
      }
      newElement.setAttribute(HELMET_ATTRIBUTE, "true");
      if (oldTags.some((existingTag, index) => {
        indexToDelete = index;
        return newElement.isEqualNode(existingTag);
      })) {
        oldTags.splice(indexToDelete, 1);
      } else {
        newTags.push(newElement);
      }
    });
  }
  oldTags.forEach((tag) => {
    var _a2;
    return (_a2 = tag.parentNode) == null ? void 0 : _a2.removeChild(tag);
  });
  newTags.forEach((tag) => headElement.appendChild(tag));
  return {
    oldTags,
    newTags
  };
};
var updateAttributes = (tagName, attributes) => {
  const elementTag = document.getElementsByTagName(tagName)[0];
  if (!elementTag) {
    return;
  }
  const helmetAttributeString = elementTag.getAttribute(HELMET_ATTRIBUTE);
  const helmetAttributes = helmetAttributeString ? helmetAttributeString.split(",") : [];
  const attributesToRemove = [...helmetAttributes];
  const attributeKeys = Object.keys(attributes);
  for (const attribute of attributeKeys) {
    const value = attributes[attribute] || "";
    if (elementTag.getAttribute(attribute) !== value) {
      elementTag.setAttribute(attribute, value);
    }
    if (helmetAttributes.indexOf(attribute) === -1) {
      helmetAttributes.push(attribute);
    }
    const indexToSave = attributesToRemove.indexOf(attribute);
    if (indexToSave !== -1) {
      attributesToRemove.splice(indexToSave, 1);
    }
  }
  for (let i = attributesToRemove.length - 1; i >= 0; i -= 1) {
    elementTag.removeAttribute(attributesToRemove[i]);
  }
  if (helmetAttributes.length === attributesToRemove.length) {
    elementTag.removeAttribute(HELMET_ATTRIBUTE);
  } else if (elementTag.getAttribute(HELMET_ATTRIBUTE) !== attributeKeys.join(",")) {
    elementTag.setAttribute(HELMET_ATTRIBUTE, attributeKeys.join(","));
  }
};
var updateTitle = (title, attributes) => {
  if (typeof title !== "undefined" && document.title !== title) {
    document.title = flattenArray(title);
  }
  updateAttributes("title", attributes);
};
var commitTagChanges = (newState, cb) => {
  const {
    baseTag,
    bodyAttributes,
    htmlAttributes,
    linkTags,
    metaTags,
    noscriptTags,
    onChangeClientState,
    scriptTags,
    styleTags,
    title,
    titleAttributes
  } = newState;
  updateAttributes("body", bodyAttributes);
  updateAttributes("html", htmlAttributes);
  updateTitle(title, titleAttributes);
  const tagUpdates = {
    baseTag: updateTags("base", baseTag),
    linkTags: updateTags("link", linkTags),
    metaTags: updateTags("meta", metaTags),
    noscriptTags: updateTags("noscript", noscriptTags),
    scriptTags: updateTags("script", scriptTags),
    styleTags: updateTags("style", styleTags)
  };
  const addedTags = {};
  const removedTags = {};
  Object.keys(tagUpdates).forEach((tagType) => {
    const { newTags, oldTags } = tagUpdates[tagType];
    if (newTags.length) {
      addedTags[tagType] = newTags;
    }
    if (oldTags.length) {
      removedTags[tagType] = tagUpdates[tagType].oldTags;
    }
  });
  if (cb) {
    cb();
  }
  onChangeClientState(newState, addedTags, removedTags);
};
var _helmetCallback = null;
var handleStateChangeOnClient = (newState) => {
  if (_helmetCallback) {
    cancelAnimationFrame(_helmetCallback);
  }
  if (newState.defer) {
    _helmetCallback = requestAnimationFrame(() => {
      commitTagChanges(newState, () => {
        _helmetCallback = null;
      });
    });
  } else {
    commitTagChanges(newState);
    _helmetCallback = null;
  }
};
var client_default = handleStateChangeOnClient;
var HelmetDispatcher = class extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "rendered", false);
  }
  shouldComponentUpdate(nextProps) {
    return !shallowEqual(nextProps, this.props);
  }
  componentDidUpdate() {
    this.emitChange();
  }
  componentWillUnmount() {
    const { helmetInstances } = this.props.context;
    helmetInstances.remove(this);
    this.emitChange();
  }
  emitChange() {
    const { helmetInstances, setHelmet } = this.props.context;
    let serverState = null;
    const state = reducePropsToState(
      helmetInstances.get().map((instance) => {
        const props = { ...instance.props };
        delete props.context;
        return props;
      })
    );
    if (HelmetProvider.canUseDOM) {
      client_default(state);
    } else if (server_default) {
      serverState = server_default(state);
    }
    setHelmet(serverState);
  }
  // componentWillMount will be deprecated
  // for SSR, initialize on first render
  // constructor is also unsafe in StrictMode
  init() {
    if (this.rendered) {
      return;
    }
    this.rendered = true;
    const { helmetInstances } = this.props.context;
    helmetInstances.add(this);
    this.emitChange();
  }
  render() {
    this.init();
    return null;
  }
};
var Helmet = (_b = class extends Component {
  shouldComponentUpdate(nextProps) {
    return !fastCompare(without(this.props, "helmetData"), without(nextProps, "helmetData"));
  }
  mapNestedChildrenToProps(child, nestedChildren) {
    if (!nestedChildren) {
      return null;
    }
    switch (child.type) {
      case "script":
      case "noscript":
        return {
          innerHTML: nestedChildren
        };
      case "style":
        return {
          cssText: nestedChildren
        };
      default:
        throw new Error(
          `<${child.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
        );
    }
  }
  flattenArrayTypeChildren(child, arrayTypeChildren, newChildProps, nestedChildren) {
    return {
      ...arrayTypeChildren,
      [child.type]: [
        ...arrayTypeChildren[child.type] || [],
        {
          ...newChildProps,
          ...this.mapNestedChildrenToProps(child, nestedChildren)
        }
      ]
    };
  }
  mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren) {
    switch (child.type) {
      case "title":
        return {
          ...newProps,
          [child.type]: nestedChildren,
          titleAttributes: { ...newChildProps }
        };
      case "body":
        return {
          ...newProps,
          bodyAttributes: { ...newChildProps }
        };
      case "html":
        return {
          ...newProps,
          htmlAttributes: { ...newChildProps }
        };
      default:
        return {
          ...newProps,
          [child.type]: { ...newChildProps }
        };
    }
  }
  mapArrayTypeChildrenToProps(arrayTypeChildren, newProps) {
    let newFlattenedProps = { ...newProps };
    Object.keys(arrayTypeChildren).forEach((arrayChildName) => {
      newFlattenedProps = {
        ...newFlattenedProps,
        [arrayChildName]: arrayTypeChildren[arrayChildName]
      };
    });
    return newFlattenedProps;
  }
  warnOnInvalidChildren(child, nestedChildren) {
    invariant(
      VALID_TAG_NAMES.some((name) => child.type === name),
      typeof child.type === "function" ? `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.` : `Only elements types ${VALID_TAG_NAMES.join(
        ", "
      )} are allowed. Helmet does not support rendering <${child.type}> elements. Refer to our API for more information.`
    );
    invariant(
      !nestedChildren || typeof nestedChildren === "string" || Array.isArray(nestedChildren) && !nestedChildren.some((nestedChild) => typeof nestedChild !== "string"),
      `Helmet expects a string as a child of <${child.type}>. Did you forget to wrap your children in braces? ( <${child.type}>{\`\`}</${child.type}> ) Refer to our API for more information.`
    );
    return true;
  }
  mapChildrenToProps(children, newProps) {
    let arrayTypeChildren = {};
    React__default.Children.forEach(children, (child) => {
      if (!child || !child.props) {
        return;
      }
      const { children: nestedChildren, ...childProps } = child.props;
      const newChildProps = Object.keys(childProps).reduce((obj, key) => {
        obj[HTML_TAG_MAP[key] || key] = childProps[key];
        return obj;
      }, {});
      let { type } = child;
      if (typeof type === "symbol") {
        type = type.toString();
      } else {
        this.warnOnInvalidChildren(child, nestedChildren);
      }
      switch (type) {
        case "Symbol(react.fragment)":
          newProps = this.mapChildrenToProps(nestedChildren, newProps);
          break;
        case "link":
        case "meta":
        case "noscript":
        case "script":
        case "style":
          arrayTypeChildren = this.flattenArrayTypeChildren(
            child,
            arrayTypeChildren,
            newChildProps,
            nestedChildren
          );
          break;
        default:
          newProps = this.mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren);
          break;
      }
    });
    return this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
  }
  render() {
    const { children, ...props } = this.props;
    let newProps = { ...props };
    let { helmetData } = props;
    if (children) {
      newProps = this.mapChildrenToProps(children, newProps);
    }
    if (helmetData && !(helmetData instanceof HelmetData)) {
      const data = helmetData;
      helmetData = new HelmetData(data.context, true);
      delete newProps.helmetData;
    }
    return helmetData ? /* @__PURE__ */ React__default.createElement(HelmetDispatcher, { ...newProps, context: helmetData.value }) : /* @__PURE__ */ React__default.createElement(Context.Consumer, null, (context) => /* @__PURE__ */ React__default.createElement(HelmetDispatcher, { ...newProps, context }));
  }
}, __publicField(_b, "defaultProps", {
  defer: true,
  encodeSpecialCharacters: true,
  prioritizeSeoTags: false
}), _b);
function SEO({ title, description, image, url = "/", type = "website", noIndex = false, language = "es" }) {
  const siteUrl = "https://www.epmwellness.com";
  const fullUrl = new URL(url, siteUrl).toString();
  const defaultImage = `${siteUrl}/attached_assets/foto_perfil_Eva_Linkedin.PNG`;
  const metaImage = image ? new URL(image, siteUrl).toString() : defaultImage;
  const finalTitle = title.includes("Eva Pérez") ? title : `${title} | Eva Pérez`;
  return /* @__PURE__ */ jsxs(Helmet, { children: [
    /* @__PURE__ */ jsx("html", { lang: language }),
    /* @__PURE__ */ jsx("title", { children: finalTitle }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
    /* @__PURE__ */ jsx("meta", { name: "robots", content: noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large" }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: fullUrl }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: type }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: fullUrl }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: finalTitle }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: metaImage }),
    /* @__PURE__ */ jsx("meta", { property: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { property: "twitter:url", content: fullUrl }),
    /* @__PURE__ */ jsx("meta", { property: "twitter:title", content: finalTitle }),
    /* @__PURE__ */ jsx("meta", { property: "twitter:description", content: description }),
    /* @__PURE__ */ jsx("meta", { property: "twitter:image", content: metaImage })
  ] });
}
const translations = {
  es: {
    "header.about": "Sobre mí",
    "header.services": "Servicios",
    "header.ai": "IA para Wellness",
    "header.portfolio": "Portfolio",
    "header.testimonials": "Testimonios",
    "header.blog": "Blog",
    "header.contact": "Contacto",
    "about.title": "Sobre mí",
    "about.subtitle": "Eva Pérez: Spa Manager y Consultora de Wellness",
    "about.experience": "Soy Eva Pérez, Spa Manager y Wellness Consultant con más de 20 años de experiencia. He dedicado mi carrera a gestionar Spas de lujo y transformar áreas de Wellness en negocios rentables.",
    "about.approach": "Como Consultora de Wellness, mi enfoque abarca desde la optimización de operaciones para Spa Managers hasta el diseño de experiencias. Eva Pérez garantiza resultados en la gestión de su Spa.",
    "about.speaker": "Además, como Eva Pérez, ponente internacional, comparto regularmente mi conocimiento como Wellness Consultant en conferencias, transmitiendo las mejores prácticas de un Spa Manager exitoso.",
    "about.stats.years": "Años de experiencia en el sector",
    "about.stats.projects": "Proyectos exitosos completados",
    "about.stats.conferences": "Conferencias impartidas",
    "about.stats.trained": "Profesionales formados",
    "about.stats.attendees": "Asistentes a conferencias",
    "about.contact": "Contactar",
    "about.portfolio": "Ver Portfolio",
    "about.speakingCaption": "Eva Pérez durante una conferencia sobre gestión de spas",
    "services.title": "Servicios",
    "services.subtitle": "Soluciones Profesionales para el Sector Wellness",
    "services.moreInfo": "Más información",
    "services.strategy.title": "Consultoría Estratégica",
    "services.strategy.description": "Análisis y diagnóstico de operaciones, desarrollo de planes estratégicos y asesoramiento para optimizar la rentabilidad de tu negocio wellness.",
    "services.projects.title": "Gestión de Proyectos",
    "services.projects.description": "Dirección integral en la creación o renovación de spas, desde la conceptualización hasta la implementación y puesta en marcha.",
    "services.training.title": "Formación y Desarrollo",
    "services.training.description": "Programas de capacitación a medida para equipos de trabajo en spas, enfocados en protocolos, ventas, servicio y gestión.",
    "services.interim.title": "Interim Management",
    "services.interim.description": "Dirección temporal de spas y centros wellness durante periodos de transición o para implementar proyectos específicos de mejora.",
    "portfolio.title": "Portfolio",
    "portfolio.subtitle": "Proyectos y Colaboraciones Destacadas",
    "portfolio.description": "Una selección de casos de éxito que demuestran mi enfoque para transformar espacios wellness y optimizar su funcionamiento.",
    "portfolio.viewCase": "Ver caso completo",
    "portfolio.viewMore": "Ver más proyectos",
    "portfolio.all": "Todos",
    "portfolio.consulting": "Consultoría",
    "portfolio.projects": "Proyectos",
    "portfolio.training": "Formación",
    "portfolio.interim": "Interim",
    "testimonials.title": "Testimonios",
    "testimonials.subtitle": "Lo que dicen mis clientes",
    "testimonials.description": "Descubre cómo mis servicios han transformado negocios wellness y equipos profesionales.",
    "blog.title": "Blog",
    "blog.subtitle": "Últimos artículos y novedades",
    "blog.description": "Artículos especializados sobre gestión de spas, tendencias del sector wellness y estrategias de optimización.",
    "blog.readArticle": "Leer artículo",
    "blog.viewAll": "Ver todos los artículos",
    "blog.readMore": "Leer más",
    "resources.title": "Recursos",
    "resources.subtitle": "Herramientas y guías para profesionales del sector",
    "resources.download": "Descargar",
    "newsletter.title": "Suscríbete a mi newsletter",
    "newsletter.subtitle": "Recibe mensualmente contenido exclusivo, consejos y las últimas tendencias en gestión de spas.",
    "newsletter.subscribe": "Suscribirme",
    "newsletter.sending": "Enviando...",
    "newsletter.leadMagnetTitle": "Descarga GRATIS la Guía de Rentabilidad",
    "newsletter.leadMagnetSubtitle": "Descubre los 10 puntos críticos para aumentar el margen de tu spa en 30 días. Incluye plantilla de auditoría.",
    "newsletter.downloadButton": "Descargar Guía Ahora",
    "header.bookAudit": "Solicitar Auditoría",
    "hero.ctaPrimary": "Mejorar mi Spa Ahora",
    "hero.ctaSecondary": "Ver Casos de Éxito",
    "contact.title": "Contacto",
    "contact.subtitle": "¿Hablamos sobre tu proyecto?",
    "contact.description": "Completa el formulario y me pondré en contacto contigo para programar una consulta inicial gratuita donde podremos hablar sobre tus necesidades específicas.",
    "contact.email": "Email",
    "contact.phone": "Teléfono",
    "contact.location": "Ubicación",
    "contact.form.name": "Nombre",
    "contact.form.email": "Email",
    "contact.form.company": "Empresa/Organización",
    "contact.form.service": "Servicio de interés",
    "contact.form.message": "Mensaje",
    "contact.form.privacy": "Acepto la política de privacidad y el tratamiento de mis datos para recibir comunicaciones.",
    "contact.form.send": "Enviar mensaje",
    "contact.form.sending": "Enviando...",
    "footer.rights": "Todos los derechos reservados",
    "footer.design": "Diseñado con",
    "booking.title": "Reserva una consulta con Eva",
    "booking.subtitle": "Selecciona una fecha y hora para tu consulta personalizada",
    "booking.selectDate": "Selecciona una fecha",
    "booking.chooseDay": "Elige el día para tu consulta",
    "booking.weekendUnavailable": "Los fines de semana no están disponibles para reservas.",
    "booking.selectTime": "Selecciona una hora",
    "booking.availableTimes": "Horarios disponibles para el",
    "booking.noSlots": "No hay horarios disponibles para esta fecha. Por favor, selecciona otro día.",
    "booking.back": "Volver",
    "booking.complete": "Completa tu reserva",
    "booking.details": "Reservando para el",
    "booking.fullName": "Nombre completo",
    "booking.namePlaceholder": "Tu nombre",
    "booking.email": "Email",
    "booking.emailPlaceholder": "tu@email.com",
    "booking.phone": "Teléfono (opcional)",
    "booking.phonePlaceholder": "Tu teléfono",
    "booking.company": "Empresa (opcional)",
    "booking.companyPlaceholder": "Tu empresa",
    "booking.service": "Servicio",
    "booking.selectService": "Selecciona un servicio",
    "booking.message": "Mensaje (opcional)",
    "booking.messagePlaceholder": "Cuéntanos brevemente sobre tu proyecto o consulta",
    "booking.privacy": "Acepto la política de privacidad",
    "booking.privacyDesc": "Al marcar esta casilla, aceptas nuestra política de privacidad.",
    "booking.confirm": "Confirmar reserva",
    "booking.sending": "Enviando...",
    "booking.successTitle": "¡Reserva completada!",
    "booking.successDesc": "Tu cita ha sido reservada correctamente. Recibirás un email de confirmación.",
    "booking.errorTitle": "Error en la reserva",
    "booking.errorDesc": "No se pudo completar la reserva. Por favor, inténtalo de nuevo.",
    "booking.fetchError": "No se pudieron cargar los horarios disponibles",
    "booking.val.name": "El nombre debe tener al menos 2 caracteres",
    "booking.val.email": "Por favor introduce un email válido",
    "booking.val.service": "Por favor selecciona un servicio",
    "booking.val.privacy": "Debes aceptar la política de privacidad",
    "chatbot.welcome": "¡Hola! Soy el asistente virtual de Eva Pérez. ¿En qué estás interesado?",
    "chatbot.error": "Lo siento, estoy teniendo problemas para conectarme.",
    "chatbot.placeholder": "Escribe tu mensaje...",
    "chatbot.send": "Enviar",
    "chatbot.typing": "Escribiendo...",
    "chatbot.title": "Asistente Virtual",
    "chatbot.subtitle": "Experta en estrategia wellness",
    "chatbot.suggestions": "Puedes preguntar sobre:",
    "chatbot.disclaimer": "Potenciado por IA para información general.",
    // Audit Modal
    "audit.title": "Solicitar Auditoría Gratuita",
    "audit.subtitle": "Descubre el potencial oculto de tu spa",
    "audit.description": "Déjame tus datos y analizaremos juntos cómo transformar tu área wellness en un motor de rentabilidad.",
    "audit.name": "Nombre completo",
    "audit.email": "Email corporativo",
    "audit.phone": "WhatsApp / Teléfono",
    "audit.hotel": "Nombre del Hotel / Spa",
    "audit.challenge": "Principal desafío actual",
    "audit.submit": "Solicitar Auditoría",
    "audit.success": "¡Solicitud recibida! Te contactaré en breve."
  },
  en: {
    "header.about": "About me",
    "header.services": "Services",
    "header.ai": "AI for Wellness",
    "header.portfolio": "Portfolio",
    "header.testimonials": "Testimonials",
    "header.blog": "Blog",
    "header.contact": "Contact",
    "about.title": "About me",
    "about.subtitle": "Eva Pérez: Spa Manager & Wellness Consultant",
    "about.experience": "With over 20 years of experience in the wellness sector and spa management, I have dedicated my career to transforming wellness spaces into profitable and memorable experiences.",
    "about.approach": "My comprehensive approach ranges from operations optimization and team training to designing unique customer experiences and implementing profitability strategies.",
    "about.speaker": "Additionally, as an international speaker, I regularly share my knowledge at conferences and industry events, where I convey best practices and trends in spa management and wellness.",
    "about.stats.years": "Years of industry experience",
    "about.stats.projects": "Successful projects completed",
    "about.stats.conferences": "Conferences delivered",
    "about.stats.trained": "Professionals trained",
    "about.stats.attendees": "Conference attendees",
    "about.contact": "Contact me",
    "about.portfolio": "View Portfolio",
    "about.speakingCaption": "Eva Pérez during a conference on spa management",
    "services.title": "Services",
    "services.subtitle": "Professional Solutions for the Wellness Sector",
    "services.moreInfo": "More information",
    "services.strategy.title": "Strategic Consulting",
    "services.strategy.description": "Operations analysis and diagnosis, strategic plan development, and advisory services to optimize the profitability of your wellness business.",
    "services.projects.title": "Project Management",
    "services.projects.description": "Comprehensive management in the creation or renovation of spas, from conceptualization to implementation and launch.",
    "services.training.title": "Training & Development",
    "services.training.description": "Tailored training programs for spa teams, focused on protocols, sales, service, and management.",
    "services.interim.title": "Interim Management",
    "services.interim.description": "Temporary management of spas and wellness centers during transition periods or to implement specific improvement projects.",
    "portfolio.title": "Portfolio",
    "portfolio.subtitle": "Featured Projects and Collaborations",
    "portfolio.description": "A selection of success cases that demonstrate my approach to transforming wellness spaces and optimizing their operation.",
    "portfolio.viewCase": "View full case",
    "portfolio.viewMore": "View more projects",
    "portfolio.all": "All",
    "portfolio.consulting": "Consulting",
    "portfolio.projects": "Projects",
    "portfolio.training": "Training",
    "portfolio.interim": "Interim",
    "testimonials.title": "Testimonials",
    "testimonials.subtitle": "What my clients say",
    "testimonials.description": "Discover how my services have transformed wellness businesses and professional teams.",
    "blog.title": "Blog",
    "blog.subtitle": "Latest articles and news",
    "blog.description": "Specialized articles on spa management, wellness industry trends, and optimization strategies.",
    "blog.readArticle": "Read article",
    "blog.viewAll": "View all articles",
    "blog.readMore": "Read more",
    "resources.title": "Resources",
    "resources.subtitle": "Tools and guides for industry professionals",
    "resources.download": "Download",
    "newsletter.title": "Subscribe to my newsletter",
    "newsletter.subtitle": "Receive monthly exclusive content, tips, and the latest trends in spa management.",
    "newsletter.subscribe": "Subscribe",
    "newsletter.sending": "Sending...",
    "newsletter.leadMagnetTitle": "Download FREE Profitability Guide",
    "newsletter.leadMagnetSubtitle": "Discover 10 critical points to increase your spa margin in 30 days. Includes audit template.",
    "newsletter.downloadButton": "Download Guide Now",
    "header.bookAudit": "Request Audit",
    "hero.ctaPrimary": "Improve my Spa Now",
    "hero.ctaSecondary": "View Success Stories",
    "contact.title": "Contact",
    "contact.subtitle": "Let's talk about your project",
    "contact.description": "Fill out the form and I will contact you to schedule a free initial consultation where we can discuss your specific needs.",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.location": "Location",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.company": "Company/Organization",
    "contact.form.service": "Service of interest",
    "contact.form.message": "Message",
    "contact.form.privacy": "I accept the privacy policy and the processing of my data to receive communications.",
    "contact.form.send": "Send message",
    "contact.form.sending": "Sending...",
    "footer.rights": "All rights reserved",
    "footer.design": "Designed with",
    "booking.title": "Book a consultation with Eva",
    "booking.subtitle": "Select a date and time for your personalized consultation",
    "booking.selectDate": "Select a date",
    "booking.chooseDay": "Choose the day for your consultation",
    "booking.weekendUnavailable": "Weekends are not available for bookings.",
    "booking.selectTime": "Select a time",
    "booking.availableTimes": "Available times for",
    "booking.noSlots": "No available times for this date. Please select another day.",
    "booking.back": "Back",
    "booking.complete": "Complete your booking",
    "booking.details": "Booking for",
    "booking.fullName": "Full name",
    "booking.namePlaceholder": "Your name",
    "booking.email": "Email",
    "booking.emailPlaceholder": "your@email.com",
    "booking.phone": "Phone (optional)",
    "booking.phonePlaceholder": "Your phone",
    "booking.company": "Company (optional)",
    "booking.companyPlaceholder": "Your company",
    "booking.service": "Service",
    "booking.selectService": "Select a service",
    "booking.message": "Message (optional)",
    "booking.messagePlaceholder": "Tell us briefly about your project or inquiry",
    "booking.privacy": "I accept the privacy policy",
    "booking.privacyDesc": "By checking this box, you agree to our privacy policy.",
    "booking.confirm": "Confirm booking",
    "booking.sending": "Sending...",
    "booking.successTitle": "Booking completed!",
    "booking.successDesc": "Your appointment has been booked successfully. You will receive a confirmation email.",
    "booking.errorTitle": "Booking error",
    "booking.errorDesc": "Could not complete the booking. Please try again.",
    "booking.fetchError": "Could not load available time slots",
    "booking.val.name": "Name must be at least 2 characters",
    "booking.val.email": "Please enter a valid email address",
    "booking.val.service": "Please select a service",
    "booking.val.privacy": "You must accept the privacy policy",
    "chatbot.welcome": "Hello! I am Eva Pérez's virtual assistant. What are you interested in?",
    "chatbot.error": "I'm sorry, I'm having connection issues.",
    "chatbot.placeholder": "Type your message...",
    "chatbot.send": "Send",
    "chatbot.typing": "Typing...",
    "chatbot.title": "Virtual Assistant",
    "chatbot.subtitle": "Wellness strategy expert",
    "chatbot.suggestions": "You can ask about:",
    "chatbot.disclaimer": "Powered by AI for general information.",
    // Audit Modal
    "audit.title": "Request Free Audit",
    "audit.subtitle": "Discover your spa's hidden potential",
    "audit.description": "Leave your details and we will analyze together how to transform your wellness area into a profitability engine.",
    "audit.name": "Full name",
    "audit.email": "Work email",
    "audit.phone": "WhatsApp / Phone",
    "audit.hotel": "Hotel / Spa Name",
    "audit.challenge": "Main current challenge",
    "audit.submit": "Request Audit",
    "audit.success": "Request received! I will contact you shortly."
  }
};
const defaultValue = {
  language: "es",
  setLanguage: () => {
  },
  t: (key) => key
};
const LanguageContext = createContext(defaultValue);
const useLanguage = () => useContext(LanguageContext);
const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("es");
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en")) {
      setLanguage(savedLanguage);
    } else {
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "en") {
        setLanguage("en");
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("language", language);
    if (!window.location.pathname.startsWith("/blog/")) {
      document.documentElement.lang = language;
    }
  }, [language]);
  const t = (key) => {
    return translations[language][key] || key;
  };
  return /* @__PURE__ */ jsx(LanguageContext.Provider, { value: { language, setLanguage, t }, children });
};
function NotFound() {
  const [location] = useLocation();
  const { language } = useLanguage();
  const isSpanish = language === "es";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: isSpanish ? "Página no encontrada" : "Page not found",
        description: isSpanish ? "La página solicitada no existe o ha cambiado de dirección." : "The requested page does not exist or has moved.",
        url: location,
        noIndex: true,
        language
      }
    ),
    /* @__PURE__ */ jsx("main", { className: "min-h-screen w-full flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsx(Card, { className: "w-full max-w-md mx-4", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex mb-4 gap-2", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "h-8 w-8 text-red-500" }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: isSpanish ? "404 · Página no encontrada" : "404 · Page not found" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-gray-600", children: isSpanish ? "La dirección solicitada no existe o ha cambiado." : "The requested address does not exist or has moved." }),
      /* @__PURE__ */ jsx(Link, { href: "/", className: "inline-block mt-6 text-turquoise hover:underline", children: isSpanish ? "Volver a la página principal" : "Return to the home page" })
    ] }) }) })
  ] });
}
const services = [
  {
    icon: "fa-search",
    title: {
      es: "Consultoría Estratégica",
      en: "Strategic Consulting"
    },
    description: {
      es: "Auditorías completas, desarrollo de conceptos y planes de optimización de rentabilidad para tu spa.",
      en: "Comprehensive audits, concept development, and profitability optimization plans for your spa."
    },
    longDescription: {
      es: `En el competitivo mundo de la hospitalidad de lujo, un spa no es solo un servicio adicional; es un destino en sí mismo y un motor crucial de ingresos y satisfacción del huésped. Mi servicio de Consultoría Estratégica está diseñado para transformar áreas de bienestar en activos de alto rendimiento, combinando excelencia operativa con rentabilidad financiera.

      Basado en tres pilares fundamentales, este servicio ofrece una solución integral para hoteles y spas que buscan la excelencia:

      1. Auditorías Operativas Completas
      No se puede mejorar lo que no se mide ni se entiende a fondo. Mis auditorías operativas son un análisis profundo de la salud de tu negocio wellness.
      
      2. Desarrollo de Conceptos Únicos
      En un mercado saturado, la diferenciación es clave. Ayudo a crear identidades de spa que resuenen con tu marca hotelera y atraigan al viajero sofisticado.
      
      3. Optimización de Rentabilidad (Revenue Management)
      La pasión por el bienestar debe ir de la mano con la sostenibilidad financiera. Transformo la gestión del spa para maximizar los ingresos sin comprometer la experiencia.`,
      en: `In the competitive world of luxury hospitality, a spa is not just an additional amenity; it is a destination in itself and a crucial driver of revenue and guest satisfaction. My Strategic Consulting service is designed to transform wellness areas into high-performance assets, combining operational excellence with financial profitability.

      Based on three fundamental pillars, this service offers a comprehensive solution for hotels and spas seeking excellence:

      1. Comprehensive Operational Audits
      You cannot improve what you do not measure or fully understand. My operational audits are a deep analysis of the health of your wellness business.

      2. Unique Concept Development
      In a saturated market, differentiation is key. I help create spa identities that resonate with your hotel brand and attract the sophisticated traveler.

      3. Profitability Optimization (Revenue Management)
      Passion for wellness must go hand in hand with financial sustainability. I transform spa management to maximize revenue without compromising the experience.`
    },
    features: {
      es: ["Auditorías operativas", "Desarrollo de conceptos", "Optimización de rentabilidad"],
      en: ["Operational audits", "Concept development", "Profitability optimization"]
    }
  },
  {
    icon: "fa-tasks",
    title: {
      es: "Gestión de Proyectos",
      en: "Project Management"
    },
    description: {
      es: "Supervisión integral de aperturas, renovaciones y mejoras de centros wellness.",
      en: "Comprehensive supervision of openings, renovations, and improvements of wellness centers."
    },
    longDescription: {
      es: `Desde la concepción inicial hasta el día de la inauguración, la gestión de un proyecto de spa requiere una coordinación meticulosa entre arquitectos, diseñadores, proveedores y equipos operativos. Mi servicio de Gestión de Proyectos asegura que tu visión se convierta en realidad, a tiempo y dentro del presupuesto.

      Abarco todas las fases críticas del proyecto:
      
      • Planificación Técnica: Revisión de planos para asegurar la funcionalidad operativa y el flujo correcto de clientes y staff.
      • Selección de Equipamiento: Asesoramiento independiente para elegir la mejor tecnología y mobiliario, negociando directamente con proveedores.
      • Pre-Opening: Creación de la estructura operativa, selección y formación del equipo, y diseño del menú de servicios antes de la apertura.
      
      Ya sea una nueva construcción o una renovación completa, actúo como el puente entre la visión creativa y la realidad operativa.`,
      en: `From initial conception to opening day, managing a spa project requires meticulous coordination between architects, designers, suppliers, and operational teams. My Project Management service ensures your vision becomes reality, on time and on budget.

      I cover all critical phases of the project:

      • Technical Planning: Review of blueprints to ensure operational functionality and correct flow of clients and staff.
      • Equipment Selection: Independent advice to choose the best technology and furniture, negotiating directly with suppliers.
      • Pre-Opening: Creation of the operational structure, team selection and training, and service menu design before opening.

      Whether it's a new build or a complete renovation, I act as the bridge between creative vision and operational reality.`
    },
    features: {
      es: ["Apertura de nuevos spas", "Renovación y reposicionamiento", "Implantación de servicios"],
      en: ["New spa openings", "Renovation and repositioning", "Service implementation"]
    }
  },
  {
    icon: "fa-users",
    title: {
      es: "Formación y Desarrollo",
      en: "Training & Development"
    },
    description: {
      es: "Programas formativos para equipos, mentoría para managers y creación de manuales.",
      en: "Training programs for teams, mentoring for managers, and creation of manuals."
    },
    longDescription: {
      es: `El activo más valioso de un spa es su equipo. Incluso las instalaciones más impresionantes fallan si el servicio no es excepcional. Mis programas de Formación y Desarrollo están diseñados para elevar las competencias técnicas y emocionales de tu personal.

      Ofrezco soluciones formativas a medida:
      
      • Excelencia en el Servicio: Protocolos de etiqueta, atención al cliente y creación de experiencias memorables.
      • Ventas y Retail: Técnicas para aumentar el ticket medio y la venta de productos sin ser intrusivos.
      • Mentoría para Spa Managers: Acompañamiento uno a uno para desarrollar las habilidades de liderazgo y gestión financiera de tus directivos.
      • Manuales Operativos (SOPs): Creación de la "biblia" de tu spa, estandarizando cada proceso para garantizar la consistencia.`,
      en: `A spa's most valuable asset is its team. Even the most impressive facilities fail if the service is not exceptional. My Training & Development programs are designed to elevate the technical and emotional competencies of your staff.

      I offer tailored training solutions:

      • Service Excellence: Etiquette protocols, customer service, and creating memorable experiences.
      • Sales & Retail: Techniques to increase average ticket and product sales without being intrusive.
      • Mentoring for Spa Managers: One-on-one coaching to develop the leadership and financial management skills of your managers.
      • Standard Operating Procedures (SOPs): Creation of your spa's "bible", standardizing every process to ensure consistency.`
    },
    features: {
      es: ["Formación de equipos", "Mentoría para managers", "Manuales operativos"],
      en: ["Team training", "Manager mentoring", "Operational manuals"]
    }
  },
  {
    icon: "fa-sync-alt",
    title: {
      es: "Interim Management",
      en: "Interim Management"
    },
    description: {
      es: "Gestión temporal de spas en transición o implementación de cambios estructurales.",
      en: "Temporary management of spas in transition or implementation of structural changes."
    },
    longDescription: {
      es: `Hay momentos críticos en la vida de un negocio donde se necesita un liderazgo experto inmediato. Ya sea por una baja inesperada de la dirección, una crisis operativa o una necesidad de reestructuración profunda, mi servicio de Interim Management ofrece una solución ejecutiva ágil y efectiva.

      Asumo el control operativo de tu spa por un periodo definido para:
      
      • Estabilizar la Operativa: Restaurar el orden y la calidad del servicio rápidamente.
      • Implementar Cambios Difíciles: Ejecutar reestructuraciones o cambios de estrategia que requieren una visión externa objetiva.
      • Cubrir Transiciones: Mantener el rendimiento del negocio mientras se busca o forma al nuevo Spa Manager permanente.
      
      Aporto la experiencia de haber gestionado múltiples centros de alto nivel, permitiéndome ser efectiva desde el primer día.`,
      en: `There are critical moments in the life of a business where immediate expert leadership is needed. Whether due to an unexpected management vacancy, an operational crisis, or a need for deep restructuring, my Interim Management service offers an agile and effective executive solution.

      I assume operational control of your spa for a defined period to:

      • Stabilize Operations: Restore order and service quality quickly.
      • Implement Difficult Changes: Execute restructurings or strategy changes that require an objective external vision.
      • Cover Transitions: Maintain business performance while searching for or training the new permanent Spa Manager.

      I bring the experience of having managed multiple high-level centers, allowing me to be effective from day one.`
    },
    features: {
      es: ["Gestión temporal", "Resolución de crisis", "Cambios estructurales"],
      en: ["Temporary management", "Crisis resolution", "Structural changes"]
    }
  }
];
const portfolioItems = [
  {
    title: {
      es: "Cadena Paradores de España",
      en: "Paradores Chain Spain"
    },
    description: {
      es: "Consultoría integral y conceptualización de marca de spa en la prestigiosa cadena Paradores. Supervisión de 13+ establecimientos históricos.",
      en: "Comprehensive consulting and spa brand conceptualization for the prestigious Paradores chain. Supervision of 13+ historic establishments."
    },
    longDescription: {
      es: `Desde 2008, he tenido el privilegio de colaborar estrechamente con Paradores de Turismo de España, una de las cadenas hoteleras más prestigiosas y singulares del mundo. Este proyecto ha implicado el reto único de integrar instalaciones de bienestar modernas en edificios históricos protegidos, como castillos, conventos y palacios.

      Mi labor ha abarcado la supervisión y consultoría de más de 13 establecimientos, incluyendo joyas como La Granja, El Saler, Alcalá de Henares, Corias y Santo Estevo. Para cada uno, se desarrolló una identidad propia que respetara la historia del lugar mientras ofrecía estándares de lujo contemporáneos.

      El trabajo incluyó la definición de los estándares de marca para toda la línea de spas, la creación de menús de tratamiento inspirados en la historia local y la formación continua de los equipos para asegurar una experiencia homogénea en toda la red.`,
      en: `Since 2008, I have had the privilege of collaborating closely with Paradores de Turismo de España, one of the most prestigious and unique hotel chains in the world. This project involved the unique challenge of integrating modern wellness facilities into protected historic buildings, such as castles, convents, and palaces.

      My work has covered the supervision and consulting of over 13 establishments, including gems like La Granja, El Saler, Alcalá de Henares, Corias, and Santo Estevo. For each, a unique identity was developed that respected the history of the place while offering contemporary luxury standards.

      The work included defining brand standards for the entire spa line, creating treatment menus inspired by local history, and continuous team training to ensure a consistent experience across the network.`
    },
    image: "/assets/new_gen/parador.png",
    chain: "paradores",
    chainName: {
      es: "Paradores",
      en: "Paradores"
    },
    highlights: {
      es: ["13+ establecimientos históricos", "Gestión desde 2008", "Estándares de calidad únicos"],
      en: ["13+ historic establishments", "Management since 2008", "Unique quality standards"]
    },
    results: {
      es: ["Estandarización exitosa de la operativa en toda la red", "Incremento del RevPATH en un 25% promedio", "Creación de protocolos exclusivos de marca"],
      en: ["Successful standardization of operations across the network", "Average RevPATH increase of 25%", "Creation of exclusive brand protocols"]
    },
    category: "consultoria",
    categoryName: {
      es: "Consultoría",
      en: "Consulting"
    }
  },
  {
    title: {
      es: "Eurostars Hotels & Resorts",
      en: "Eurostars Hotels & Resorts"
    },
    description: {
      es: "Gestión integral de centros wellness de lujo, destacando el Hotel Aurea Convento Capuchinos en Segovia.",
      en: "Comprehensive management of luxury wellness centers, highlighting Hotel Aurea Convento Capuchinos in Segovia."
    },
    longDescription: {
      es: `La colaboración con Eurostars Hotels & Resorts se ha centrado en elevar el perfil de sus activos de bienestar en propiedades clave. El proyecto más emblemático ha sido el Hotel Aurea Convento Capuchinos en Segovia, donde gestioné el spa desde su inauguración en 2014.

      El desafío principal fue posicionar el spa no solo como un servicio para huéspedes, sino como un destino de bienestar para la ciudad de Segovia. Implementamos una estrategia de apertura al público local que transformó el modelo de negocio.

      Además, supervisé la gestión del Eurostars Mijas, enfocándome en la optimización de la rentabilidad en un entorno de resort de alta competencia en la Costa del Sol.`,
      en: `The collaboration with Eurostars Hotels & Resorts has focused on raising the profile of their wellness assets in key properties. The most emblematic project has been the Hotel Aurea Convento Capuchinos in Segovia, where I managed the spa since its opening in 2014.

      The main challenge was to position the spa not only as a guest amenity but as a wellness destination for the city of Segovia. We implemented a strategy of opening to the local public that transformed the business model.

      Additionally, I supervised the management of Eurostars Mijas, focusing on profitability optimization in a highly competitive resort environment on the Costa del Sol.`
    },
    image: "/assets/new_gen/eurostars.png",
    chain: "eurostars",
    chainName: {
      es: "Eurostars",
      en: "Eurostars"
    },
    highlights: {
      es: ["Spa de referencia en Segovia", "Gestión desde 2014", "Apertura a la ciudad"],
      en: ["Reference spa in Segovia", "Management since 2014", "City opening strategy"]
    },
    results: {
      es: ["Captación de un 40% de clientela externa local", "Reconocimiento como mejor spa urbano de la región", "Optimización de costes operativos"],
      en: ["Capture of 40% local external clientele", "Recognition as the best urban spa in the region", "Operational cost optimization"]
    },
    category: "proyectos",
    categoryName: {
      es: "Proyectos",
      en: "Projects"
    }
  },
  {
    title: {
      es: "Cadena HG Hoteles de Montaña",
      en: "HG Mountain Hotels Chain"
    },
    description: {
      es: "Gestión operativa completa de spas en destinos alpinos premium: HG Cerler, HG La Molina y HG Formigal.",
      en: "Complete operational management of spas in premium alpine destinations: HG Cerler, HG La Molina, and HG Formigal."
    },
    longDescription: {
      es: `La gestión de spas en destinos de esquí presenta desafíos únicos: estacionalidad extrema, necesidades específicas de recuperación muscular para deportistas y logística compleja en alta montaña. Con HG Hoteles, asumí la supervisión de sus centros en Cerler, La Molina y Formigal.

      Desarrollamos una carta de servicios "Après-Ski" altamente especializada, enfocada en la recuperación muscular y la relajación profunda tras la jornada de deporte. Esto nos permitió maximizar la ocupación en las horas punta de la tarde.

      También implementamos programas de formación intensiva para equipos temporales, asegurando que la calidad del servicio se mantuviera alta a pesar de la rotación natural de la temporada.`,
      en: `Managing spas in ski destinations presents unique challenges: extreme seasonality, specific muscle recovery needs for athletes, and complex logistics in high mountains. With HG Hotels, I assumed supervision of their centers in Cerler, La Molina, and Formigal.

      We developed a highly specialized "Après-Ski" service menu, focused on muscle recovery and deep relaxation after a day of sports. This allowed us to maximize occupancy during peak afternoon hours.

      We also implemented intensive training programs for temporary teams, ensuring that service quality remained high despite the natural turnover of the season.`
    },
    image: "/assets/new_gen/hg.png",
    chain: "hg",
    chainName: {
      es: "HG Hotels",
      en: "HG Hotels"
    },
    highlights: {
      es: ["3 resorts de montaña", "Servicios especializados ski", "Alta ocupación estacional"],
      en: ["3 mountain resorts", "Specialized ski services", "High seasonal occupancy"]
    },
    results: {
      es: ["Maximización de ingresos en temporada corta", 'Diseño de tratamientos firma "Après-Ski"', "Alta fidelización de clientes repetidores"],
      en: ["Revenue maximization in short season", 'Design of signature "Après-Ski" treatments', "High loyalty of returning customers"]
    },
    category: "interim",
    categoryName: {
      es: "Interim",
      en: "Interim"
    }
  },
  {
    title: {
      es: "Meliá Hotels International",
      en: "Meliá Hotels International"
    },
    description: {
      es: "Dirección de wellness centers en resorts premium: Meliá Tanau, Meliá Isla Canela y Meliá Alto Aragón.",
      en: "Management of wellness centers in premium resorts: Meliá Tanau, Meliá Isla Canela, and Meliá Alto Aragón."
    },
    longDescription: {
      es: `Trabajar con una marca global como Meliá requiere un alineamiento perfecto con estándares internacionales de excelencia. Mi rol abarcó la dirección de wellness centers en ubicaciones diversas, desde la playa en Isla Canela hasta la montaña en Tanau y Alto Aragón.

      El foco principal fue la implementación de protocolos de calidad rigurosos y la creación de experiencias que elevaran la percepción de valor del resort. En Meliá Tanau, por ejemplo, posicionamos el spa como un servicio VIP exclusivo para los clientes de las suites y el servicio Royal Service.

      La gestión incluyó la integración de los sistemas de reservas del spa con el PMS del hotel para una experiencia de cliente sin fricciones y una mejor captura de datos.`,
      en: `Working with a global brand like Meliá requires perfect alignment with international standards of excellence. My role covered the management of wellness centers in diverse locations, from the beach in Isla Canela to the mountains in Tanau and Alto Aragón.

      The main focus was the implementation of rigorous quality protocols and the creation of experiences that elevated the resort's value perception. At Meliá Tanau, for example, we positioned the spa as an exclusive VIP service for suite and Royal Service guests.

      Management included integrating spa booking systems with the hotel's PMS for a frictionless customer experience and better data capture.`
    },
    image: "/assets/new_gen/melia.png",
    chain: "melia",
    chainName: {
      es: "Meliá",
      en: "Meliá"
    },
    highlights: {
      es: ["Resorts premium internacionales", "Protocolos de lujo", "Experiencias exclusivas"],
      en: ["Premium international resorts", "Luxury protocols", "Exclusive experiences"]
    },
    results: {
      es: ["Integración total con la experiencia del huésped", "Aumento del ticket medio por habitación", "Excelentes puntuaciones en auditorías de calidad"],
      en: ["Full integration with guest experience", "Increase in average ticket per room", "Excellent scores in quality audits"]
    },
    category: "consultoria",
    categoryName: {
      es: "Consultoría",
      en: "Consulting"
    }
  },
  {
    title: {
      es: "AXEL Hotels - Wellness Urbano",
      en: "AXEL Hotels - Urban Wellness"
    },
    description: {
      es: "Gestión de spas urbanos de vanguardia para AXEL Hotels en Madrid e Ibiza. Experiencias innovadoras.",
      en: "Management of cutting-edge urban spas for AXEL Hotels in Madrid and Ibiza. Innovative experiences."
    },
    longDescription: {
      es: `AXEL Hotels se dirige a un público cosmopolita y exigente que busca experiencias más allá de lo tradicional. En los proyectos de Madrid e Ibiza, el objetivo fue romper con el concepto clásico de spa y crear espacios de socialización y bienestar vibrantes.

      Diseñamos menús de tratamiento atrevidos y modernos, alineados con la filosofía "heterofriendly" y de libertad de la marca. La gestión operativa tuvo que adaptarse a horarios extendidos y a una demanda de servicios de estética avanzada y preparación para eventos sociales.

      El éxito radicó en entender el estilo de vida del cliente AXEL y ofrecer un producto wellness que se sintiera como una extensión natural de su experiencia de ocio.`,
      en: `AXEL Hotels targets a cosmopolitan and demanding audience seeking experiences beyond the traditional. In the Madrid and Ibiza projects, the goal was to break with the classic spa concept and create vibrant socialization and wellness spaces.

      We designed bold and modern treatment menus, aligned with the brand's "heterofriendly" and freedom philosophy. Operational management had to adapt to extended hours and a demand for advanced aesthetic services and social event preparation.

      Success lay in understanding the AXEL customer lifestyle and offering a wellness product that felt like a natural extension of their leisure experience.`
    },
    image: "/assets/new_gen/axel.png",
    chain: "axel",
    chainName: {
      es: "AXEL",
      en: "AXEL"
    },
    highlights: {
      es: ["Diseño vanguardista", "Público cosmopolita", "Ubicaciones premium"],
      en: ["Avant-garde design", "Cosmopolitan clientele", "Premium locations"]
    },
    results: {
      es: ['Posicionamiento como "Social Spa"', "Alta demanda de tratamientos pre-party", "Fuerte identidad de marca"],
      en: ['Positioning as "Social Spa"', "High demand for pre-party treatments", "Strong brand identity"]
    },
    category: "proyectos",
    categoryName: {
      es: "Proyectos",
      en: "Projects"
    }
  },
  {
    title: {
      es: "Proyectos Independientes Premium",
      en: "Premium Independent Projects"
    },
    description: {
      es: "Consultoría y gestión para hoteles independientes: Hotel Valencia Congress, Hacienda del Álamo, y más.",
      en: "Consulting and management for independent hotels: Hotel Valencia Congress, Hacienda del Álamo, and more."
    },
    longDescription: {
      es: `Los hoteles independientes ofrecen la libertad de crear conceptos totalmente únicos. He tenido el placer de trabajar con propiedades singulares como el Hotel Valencia Congress, Golf Resort Hacienda del Álamo, Hilton La Torre y el Hotel Pazo Los Escudos.

      En cada uno de estos proyectos, la clave ha sido conectar con la comunidad local. Por ejemplo, en Hacienda del Álamo, desarrollamos un exitoso programa de membresías que convirtió al spa en el club social de referencia de la zona. En el NH Collection Constanza, logramos una base de clientes fieles en menos de un año.

      Mi enfoque con los independientes es crear un modelo de negocio sostenible que no dependa únicamente de la ocupación del hotel, blindando así los ingresos del spa.`,
      en: `Independent hotels offer the freedom to create totally unique concepts. I have had the pleasure of working with unique properties such as Hotel Valencia Congress, Golf Resort Hacienda del Álamo, Hilton La Torre, and Hotel Pazo Los Escudos.

      In each of these projects, the key has been connecting with the local community. For example, at Hacienda del Álamo, we developed a successful membership program that turned the spa into the area's reference social club. At NH Collection Constanza, we achieved a loyal customer base in less than a year.

      My approach with independents is to create a sustainable business model that does not rely solely on hotel occupancy, thus shielding spa revenue.`
    },
    image: "/assets/new_gen/boutique.png",
    chain: "independientes",
    chainName: {
      es: "Independientes",
      en: "Independent"
    },
    highlights: {
      es: ["20+ proyectos boutique", "Identidades únicas", "Captación clientela local"],
      en: ["20+ boutique projects", "Unique identities", "Local clientele attraction"]
    },
    results: {
      es: ["Programas de membresía exitosos", "Reducción de la dependencia de la ocupación hotelera", "Creación de destinos wellness locales"],
      en: ["Successful membership programs", "Reduced dependence on hotel occupancy", "Creation of local wellness destinations"]
    },
    category: "formacion",
    categoryName: {
      es: "Formación",
      en: "Training"
    }
  }
];
const testimonials = [
  {
    quote: {
      es: "Eva transformó completamente nuestro spa. Su experiencia y visión estratégica nos permitieron incrementar nuestros ingresos en un 40% en tan solo 3 meses, mejorando simultáneamente la satisfacción de nuestros clientes.",
      en: "Eva completely transformed our spa. Her experience and strategic vision allowed us to increase our revenue by 40% in just 3 months, while simultaneously improving customer satisfaction."
    },
    name: "María González",
    position: {
      es: "Directora, Serenity Wellness Resort",
      en: "Director, Serenity Wellness Resort"
    },
    avatar: "/assets/new_gen/avatar_1.png"
  },
  {
    quote: {
      es: "El programa de formación que Eva desarrolló para nuestro equipo elevó nuestro nivel de servicio a estándares internacionales. Su enfoque práctico y su profundo conocimiento del sector han sido transformadores.",
      en: "The training program that Eva developed for our team elevated our service level to international standards. Her practical approach and deep industry knowledge have been transformative."
    },
    name: "Carlos Mendoza",
    position: {
      es: "CEO, Wellness Collective",
      en: "CEO, Wellness Collective"
    },
    avatar: "/assets/new_gen/avatar_2.png"
  },
  {
    quote: {
      es: "Contar con Eva como consultora durante la apertura de nuestro nuevo spa fue la mejor decisión que tomamos. Su atención al detalle, conocimiento operativo y capacidad para formar a nuestro equipo fueron excepcionales.",
      en: "Having Eva as a consultant during the opening of our new spa was the best decision we made. Her attention to detail, operational knowledge, and ability to train our team were exceptional."
    },
    name: "Laura Serrano",
    position: {
      es: "Propietaria, Pure Bliss Day Spa",
      en: "Owner, Pure Bliss Day Spa"
    },
    avatar: "/assets/new_gen/avatar_3.png"
  },
  {
    quote: {
      es: "La intervención de Eva como interim manager durante nuestra reestructuración fue clave para mantener la calidad del servicio mientras implementábamos cambios profundos en nuestra operativa.",
      en: "Eva's intervention as an interim manager during our restructuring was key to maintaining service quality while implementing deep changes in our operations."
    },
    name: "Javier Moreno",
    position: {
      es: "Director General, Luxury Spa Collection",
      en: "General Manager, Luxury Spa Collection"
    },
    avatar: "/assets/new_gen/avatar_4.png"
  }
];
const resources = [
  {
    title: {
      es: "KPIs esenciales para la gestión de spas",
      en: "Essential KPIs for spa management"
    },
    description: {
      es: "Descubre los indicadores clave que todo spa manager debe monitorizar para asegurar el éxito de su negocio.",
      en: "Discover the key indicators that every spa manager should monitor to ensure business success."
    },
    image: "/assets/new_gen/res_kpi.png",
    buttonText: {
      es: "Leer guía",
      en: "Read guide"
    },
    content: {
      es: [
        "## Introducción a los KPIs en el Spa",
        "La gestión de un spa no puede basarse únicamente en la intuición. Para garantizar la rentabilidad y la sostenibilidad del negocio, es fundamental monitorizar una serie de indicadores clave de rendimiento (KPIs).",
        "### 1. Ingreso por Hora de Tratamiento Disponible (RevPATH)",
        "Este es quizás el indicador más importante. Mide la eficiencia con la que utilizas tu inventario principal: el tiempo y el espacio.",
        "**Fórmula:** `Ingresos Totales de Spa / (Horas de Cabina Disponibles x Número de Cabinas)`",
        "### 2. Tasa de Ocupación de Cabinas",
        "Indica qué porcentaje de tu capacidad máxima estás utilizando. Una ocupación del 100% no siempre es ideal, ya que puede impedir reservas de última hora de clientes VIP.",
        "**Meta ideal:** Entre 75% y 85%.",
        "### 3. Ticket Medio (Average Ticket)",
        "Cuánto gasta en promedio cada cliente por visita. Aumentar este valor suele ser más rentable que adquirir nuevos clientes.",
        "**Estrategias:** Up-selling (ofrecer un tratamiento superior) y Cross-selling (vender productos retail).",
        "### 4. Ratio de Venta de Retail (Retail to Service Ratio)",
        "Mide qué porcentaje de tus ingresos totales proviene de la venta de productos. Un equipo bien formado debería ser capaz de recomendar productos para el cuidado en casa.",
        "**Meta:** El retail debería representar al menos el 20-25% de los ingresos totales.",
        "### 5. Tasa de Retención de Clientes",
        "Es mucho más costoso captar un nuevo cliente que mantener uno existente. Este KPI mide la lealtad de tu clientela.",
        "**Acción:** Implementar programas de fidelización y seguimiento post-tratamiento."
      ],
      en: [
        "## Introduction to Spa KPIs",
        "Spa management cannot rely solely on intuition. To ensure business profitability and sustainability, it is crucial to monitor a series of Key Performance Indicators (KPIs).",
        "### 1. Revenue Per Available Treatment Hour (RevPATH)",
        "This is perhaps the most important indicator. It measures how efficiently you are using your main inventory: time and space.",
        "**Formula:** `Total Spa Revenue / (Available Treatment Hours x Number of Treatment Rooms)`",
        "### 2. Treatment Room Occupancy Rate",
        "Indicates what percentage of your maximum capacity you are using. 100% occupancy is not always ideal, as it may prevent last-minute bookings from VIP guests.",
        "**Ideal Goal:** Between 75% and 85%.",
        "### 3. Average Ticket",
        "How much each client spends on average per visit. Increasing this value is usually more profitable than acquiring new clients.",
        "**Strategies:** Up-selling (offering a superior treatment) and Cross-selling (selling retail products).",
        "### 4. Retail to Service Ratio",
        "Measures what percentage of your total revenue comes from product sales. A well-trained team should be able to recommend home care products.",
        "**Goal:** Retail should represent at least 20-25% of total revenue.",
        "### 5. Client Retention Rate",
        "It is much more expensive to acquire a new client than to keep an existing one. This KPI measures the loyalty of your clientele.",
        "**Action:** Implement loyalty programs and post-treatment follow-up."
      ]
    },
    resourceType: "kpi"
  },
  {
    title: {
      es: "Checklist: 50 puntos para optimizar la experiencia",
      en: "Checklist: 50 points to optimize the experience"
    },
    description: {
      es: "Una lista exhaustiva de elementos a revisar para asegurar que tus clientes disfruten de una experiencia excepcional.",
      en: "A comprehensive list of items to review to ensure your clients enjoy an exceptional experience."
    },
    image: "/assets/new_gen/res_checklist.png",
    buttonText: {
      es: "Ver checklist",
      en: "View checklist"
    },
    content: {
      es: [
        "## La Experiencia de Cliente Perfecta",
        "Desde la reserva hasta la despedida, cada punto de contacto cuenta. Utiliza este checklist para auditar tu spa.",
        "### 📞 Fase 1: Reserva y Llegada",
        "- [ ] El teléfono se responde antes del tercer tono.",
        "- [ ] Se utiliza el nombre del cliente al menos tres veces durante la reserva.",
        "- [ ] Se envían confirmaciones automáticas por email/SMS 24h antes.",
        "- [ ] La recepción está impecable, sin papeles desordenados a la vista.",
        "- [ ] Se ofrece una bebida de bienvenida inmediatamente al llegar.",
        "### 🧖‍♀️ Fase 2: Vestuarios y Zonas Húmedas",
        "- [ ] Taquillas limpias y libres de objetos de clientes anteriores.",
        "- [ ] Albornoces y toallas esponjosos, sin hilos sueltos ni manchas.",
        "- [ ] Dispensadores de jabón/champú llenos y limpios.",
        "- [ ] Temperatura del agua de duchas y piscinas verificada cada 2 horas.",
        "- [ ] Música ambiental a volumen adecuado (apenas perceptible).",
        "### 💆‍♂️ Fase 3: El Tratamiento",
        "- [ ] El terapeuta se presenta con nombre y sonrisa.",
        "- [ ] Se realiza una consulta previa sobre contraindicaciones y preferencias.",
        "- [ ] La cabina tiene la iluminación y temperatura ajustadas antes de entrar.",
        "- [ ] Privacidad absoluta durante el cambio de ropa.",
        "- [ ] El masaje comienza y termina puntualmente.",
        "### 🛍️ Fase 4: Despedida y Retail",
        "- [ ] Se ofrecen recomendaciones de cuidado en casa (no venta agresiva).",
        "- [ ] Se acompaña al cliente a la recepción.",
        "- [ ] El proceso de pago es rápido y fluido.",
        "- [ ] Se invita al cliente a reservar su próxima cita.",
        "- [ ] Se envía una encuesta de satisfacción 24h después."
      ],
      en: [
        "## The Perfect Guest Experience",
        "From booking to farewell, every touchpoint matters. Use this checklist to audit your spa.",
        "### 📞 Phase 1: Booking & Arrival",
        "- [ ] Phone is answered before the third ring.",
        "- [ ] Client's name is used at least three times during booking.",
        "- [ ] Automated confirmations sent via email/SMS 24h prior.",
        "- [ ] Reception is spotless, no cluttered papers in sight.",
        "- [ ] A welcome drink is offered immediately upon arrival.",
        "### 🧖‍♀️ Phase 2: Locker Rooms & Wet Areas",
        "- [ ] Lockers clean and free of previous guests' items.",
        "- [ ] Robes and towels fluffy, no loose threads or stains.",
        "- [ ] Soap/shampoo dispensers full and clean.",
        "- [ ] Shower and pool water temperature checked every 2 hours.",
        "- [ ] Ambient music at appropriate volume (barely perceptible).",
        "### 💆‍♂️ Phase 3: The Treatment",
        "- [ ] Therapist introduces themselves with a name and smile.",
        "- [ ] Pre-treatment consultation on contraindications and preferences held.",
        "- [ ] Treatment room lighting and temperature adjusted before entry.",
        "- [ ] Absolute privacy ensuring clothing change.",
        "- [ ] Massage starts and ends punctually.",
        "### 🛍️ Phase 4: Farewell & Retail",
        "- [ ] Home care recommendations offered (no aggressive selling).",
        "- [ ] Client is escorted to reception.",
        "- [ ] Payment process is fast and smooth.",
        "- [ ] Client is invited to book their next appointment.",
        "- [ ] Satisfaction survey sent 24h later."
      ]
    },
    resourceType: "checklist"
  },
  {
    title: {
      es: "Plantilla: Plan de formación para equipos",
      en: "Template: Training plan for teams"
    },
    description: {
      es: "Una estructura base para desarrollar programas de formación efectivos para tu equipo de spa.",
      en: "A base structure for developing effective training programs for your spa team."
    },
    image: "/assets/new_gen/res_training.png",
    buttonText: {
      es: "Ver plan",
      en: "View plan"
    },
    content: {
      es: [
        "## Plan de Formación Continua",
        "Un equipo bien formado es el activo más valioso de un spa de lujo. Utiliza esta estructura para planificar el año.",
        "### Trimestre 1: Excelencia y Protocolos",
        "**Objetivo:** Estandarizar la calidad del servicio.",
        "1. **Semana 1:** Revisión de Estándares de Marca (Grooming, lenguaje, etiqueta).",
        "2. **Semana 2:** Protocolos de Bienvenida y Despedida (Role-playing).",
        "3. **Semana 3:** Gestión de Quejas y Recuperación de Servicio.",
        "4. **Semana 4:** Evaluación práctica de estándares.",
        "### Trimestre 2: Venta y Conocimiento de Producto",
        "**Objetivo:** Aumentar el ticket medio y venta retail.",
        "1. **Semana 1:** Ingredientes activos y beneficios de la línea principal.",
        "2. **Semana 2:** Técnicas de venta consultiva (Diagnóstico vs Venta).",
        "3. **Semana 3:** Cierre de ventas y manejo de objeciones.",
        "4. **Semana 4:** Concurso interno de ventas.",
        "### Trimestre 3: Técnica y Novedades",
        "**Objetivo:** Refrescar habilidades manuales e introducir nuevos tratamientos.",
        "1. **Semana 1:** Repaso de masaje Sueco y Tejido Profundo (Ergonomía del terapeuta).",
        "2. **Semana 2:** Formación en nuevo tratamiento de temporada.",
        "3. **Semana 3:** Aparatología (si aplica) y seguridad.",
        "4. **Semana 4:** Intercambio de tratamientos entre terapeutas (Team bonding).",
        "### Trimestre 4: Bienestar Emocional y Soft Skills",
        "**Objetivo:** Mejorar la conexión con el cliente y el clima laboral.",
        "1. **Semana 1:** Inteligencia emocional en el servicio.",
        "2. **Semana 2:** Gestión del estrés para terapeutas.",
        "3. **Semana 3:** Mindfulness aplicado al tratamiento.",
        "4. **Semana 4:** Evaluación anual de desempeño y plan de carrera."
      ],
      en: [
        "## Continuous Training Plan",
        "A well-trained team is the most valuable asset of a luxury spa. Use this structure to plan the year.",
        "### Quarter 1: Excellence & Protocols",
        "**Goal:** Standardize service quality.",
        "1. **Week 1:** Brand Standards Review (Grooming, language, etiquette).",
        "2. **Week 2:** Welcome and Farewell Protocols (Role-playing).",
        "3. **Week 3:** Complaint Management and Service Recovery.",
        "4. **Week 4:** Practical standards evaluation.",
        "### Quarter 2: Sales & Product Knowledge",
        "**Goal:** Increase average ticket and retail sales.",
        "1. **Week 1:** Active ingredients and benefits of the main line.",
        "2. **Week 2:** Consultative sales techniques (Diagnosis vs Sales).",
        "3. **Week 3:** Closing sales and handling objections.",
        "4. **Week 4:** Internal sales contest.",
        "### Quarter 3: Technique & News",
        "**Goal:** Refresh manual skills and introduce new treatments.",
        "1. **Week 1:** Swedish and Deep Tissue Massage Review (Therapist ergonomics).",
        "2. **Week 2:** Training on new seasonal treatment.",
        "3. **Week 3:** Equipment (if applicable) and safety.",
        "4. **Week 4:** Treatment exchange between therapists (Team bonding).",
        "### Quarter 4: Emotional Wellness & Soft Skills",
        "**Goal:** Improve connection with the client and work climate.",
        "1. **Week 1:** Emotional intelligence in service.",
        "2. **Week 2:** Stress management for therapists.",
        "3. **Week 3:** Mindfulness applied to treatment.",
        "4. **Week 4:** Annual performance evaluation and career plan."
      ]
    },
    resourceType: "training"
  }
];
const blogPosts = [
  {
    title: {
      es: "Tendencias Spa 2026: Del 'Mimo' a la Longevidad Científica",
      en: "Spa Trends 2026: From 'Pampering' to Scientific Longevity"
    },
    excerpt: {
      es: "Descubre las 5 tendencias que definirán el bienestar de lujo en 2026. Aviso para navegantes: si solo vendes masajes, te estás quedando atrás.",
      en: "Discover the 5 trends that will define luxury wellness in 2026. Warning: if you're only selling massages, you're falling behind."
    },
    image: "/attached_assets/blog_longevity_luxury_spa_v2.png",
    date: {
      es: "10 Febrero, 2026",
      en: "February 10, 2026"
    },
    category: {
      es: "Tendencias",
      en: "Trends"
    },
    readTime: {
      es: "5 min lectura",
      en: "5 min read"
    },
    content: {
      es: [
        "El mundo del wellness está cambiando a una velocidad vertiginosa. Lo que en 2024 era 'innovador', en 2026 será el estándar básico. Como consultora estratégica, mi trabajo es diferenciar entre modas pasajeras y cambios estructurales de mercado. Aquí te presento las 5 tendencias que realmente impactarán en la cuenta de resultados de los hoteles de lujo.",
        "**1. La Era de la Longevidad Femenina**",
        "Por fin, el sector deja de tratar a las mujeres como 'hombres pequeños'. En 2026, veremos programas clínicos diseñados específicamente para la biología femenina: optimización hormonal, gestión de la menopausia como una etapa de poder (no de declive) y salud ovárica. Los spas que ofrezcan programas de 'Longevity for Her' con respaldo médico captarán al segmento de mercado con mayor poder adquisitivo.",
        "**2. 'Social Wellness' vs. Soledad**",
        "La pandemia de soledad global ha creado una contra-tendencia: la socialización saludable. Los huéspedes ya no quieren encerrarse en una cabina oscura por 60 minutos. Buscan clubes de baño romanos modernos, saunas comunitarias de diseño y experiencias de contraste (frío/calor) en grupo. El spa se convierte en el nuevo club social, reemplazando al bar del hotel.",
        "**3. Dormir es el Nuevo Lujo (Clinical Sleep)**",
        "Ya no basta con una carta de almohadas. Los programas de sueño de 2026 incluyen diagnósticos clínicos de apnea, colchones con IA que regulan la temperatura en tiempo real y terapias de luz circadiana. Los hoteles que garanticen 'el mejor sueño de tu vida' con datos que lo respalden, podrán cobrar un premium significativo por habitación.",
        "**4. Biohacking Estético**",
        "La belleza se fusiona con la biotecnología. Olvida los tratamientos faciales superficiales. Hablamos de exosomas, terapia con células madre y láseres fríos que regeneran el colágeno a nivel celular. El cliente de lujo busca resultados visibles inmediatos y salud dérmica a largo plazo, no solo 'sentirse bien'.",
        "**5. La Integración de la IA Invisible**",
        "La tecnología no reemplazará al terapeuta, lo potenciará. Imagina un sistema que ajusta la música, la temperatura y la aromaterapia de la cabina basándose en la variabilidad de la frecuencia cardíaca (VFC) del cliente en tiempo real. Hiper-personalización automática para asegurar una relajación profunda.",
        "**¿Está tu spa preparado para 2026?**",
        "Adaptarse a estas tendencias no requiere necesariamente una reforma millonaria, pero sí un cambio de mentalidad y estrategia. Si quieres analizar cómo integrar estos conceptos en tu menú de servicios actual para aumentar tu ticket medio, hablemos."
      ],
      en: [
        "The wellness world is changing at breakneck speed. What was 'innovative' in 2024 will be the basic standard in 2026. As a strategic consultant, my job is to differentiate between passing fads and structural market changes. Here are the 5 trends that will truly impact the bottom line of luxury hotels.",
        "**1. The Era of Female Longevity**",
        "Finally, the sector stops treating women like 'small men'. In 2026, we will see clinical programs designed specifically for female biology: hormonal optimization, menopause management as a stage of power (not decline), and ovarian health. Spas offering medically-backed 'Longevity for Her' programs will capture the market segment with the highest purchasing power.",
        "**2. 'Social Wellness' vs. Loneliness**",
        "The global loneliness pandemic has created a counter-trend: healthy socialization. Guests no longer want to lock themselves in a dark room for 60 minutes. They seek modern Roman bath clubs, designer communal saunas, and group contrast (hot/cold) experiences. The spa becomes the new social club, replacing the hotel bar.",
        "**3. Sleep is the New Luxury (Clinical Sleep)**",
        "A pillow menu is no longer enough. 2026 sleep programs include clinical apnea diagnostics, AI mattresses that regulate temperature in real-time, and circadian light therapies. Hotels that guarantee 'the best sleep of your life' with backing data can charge a significant room premium.",
        "**4. Aesthetic Biohacking**",
        "Beauty fuses with biotechnology. Forget superficial facials. We are talking about exosomes, stem cell therapy, and cold lasers that regenerate collagen at a cellular level. The luxury client seeks immediate visible results and long-term dermal health, not just 'feeling good'.",
        "**5. Invisible AI Integration**",
        "Technology will not replace the therapist; it will empower them. Imagine a system that adjusts the room's music, temperature, and aromatherapy based on the client's Heart Rate Variability (HRV) in real-time. Automatic hyper-personalization to ensure deep relaxation.",
        "**Is your spa ready for 2026?**",
        "Adapting to these trends doesn't necessarily require a million-dollar renovation, but it does require a shift in mindset and strategy. If you want to analyze how to integrate these concepts into your current service menu to increase your average ticket, let's talk."
      ]
    }
  },
  {
    title: {
      es: "El Secreto de la Longevidad: Cómo los Hoteles de Lujo Están Innovando en Bienestar",
      en: "The Secret of Longevity: How Luxury Hotels Are Innovating in Wellness"
    },
    excerpt: {
      es: "Descubre cómo la ciencia de la longevidad y el biohacking están transformando la experiencia del spa de lujo, convirtiendo los hoteles en destinos de renovación biológica.",
      en: "Discover how longevity science and biohacking are transforming the luxury spa experience, turning hotels into destinations for biological renewal."
    },
    image: "/attached_assets/blog_longevity_luxury_spa_v2.png",
    date: {
      es: "12 Diciembre, 2025",
      en: "December 12, 2025"
    },
    category: {
      es: "Longevidad",
      en: "Longevity"
    },
    readTime: {
      es: "6 min lectura",
      en: "6 min read"
    },
    content: {
      es: [
        "El sector de la hospitalidad de lujo está experimentando una transformación sin precedentes en 2025. El huésped moderno ya no busca solo opulencia estética o relajación pasiva, sino una vitalidad medible y una extensión de su 'healthspan' (años de vida saludable). Los hoteles de élite están evolucionando para convertirse en verdaderos santuarios de longevidad, integrando medicina preventiva avanzada en sus ofertas de bienestar.",
        "**La Nueva Era del Medical Wellness de Lujo**",
        "Estamos presenciando la convergencia definitiva entre la hospitalidad y la medicina. Resorts en destinos como Suiza, Tailandia y ahora también en España, están incorporando clínicas completas dirigidas por equipos médicos multidisciplinares. Ya no hablamos solo de masajes, sino de diagnósticos moleculares, análisis de biomarcadores en tiempo real y terapias epigenéticas diseñadas para revertir el reloj biológico.",
        "**Tecnologías de Vanguardia al Servicio del Huésped**",
        "Entre las innovaciones más destacadas se encuentran las cámaras hiperbáricas de oxígeno, que saturan el plasma sanguíneo para acelerar la regeneración celular y la función cognitiva. La crioterapia de cuerpo entero, a temperaturas de -110°C, se ofrece no solo para la recuperación muscular de atletas, sino como un potente antiinflamatorio sistémico y estimulante del metabolismo. Además, terapias de fotobiomodulación (luz roja e infrarroja) se están estandarizando para mejorar la salud mitocondrial mientras el huésped descansa.",
        "**Nutrición de Precisión y Suplementación**",
        "La experiencia culinaria también se ha redefinido. Los menús ya no se basan solo en el sabor, sino en la densidad nutricional y la compatibilidad genética. A través de pruebas de nutrigenómica, los chefs diseñan planes de alimentación personalizados que reducen la inflamación y optimizan la energía. Esto se complementa con 'barras de alquimia' donde se sirven sueros intravenosos (IV Drips) de vitaminas y nootrópicos, personalizados según las carencias específicas detectadas en el check-in.",
        "**El Objetivo Final: Transformación Biológica**",
        "El lujo en 2025 se define por el resultado: devolver al huésped a su vida cotidiana no solo descansado, sino biológicamente optimizado. Los programas de sueño, por ejemplo, utilizan colchones inteligentes y monitoreo biométrico para reestructurar la arquitectura del sueño del cliente. En definitiva, estos hoteles no venden camas, venden años de vida de calidad."
      ],
      en: [
        "The luxury hospitality sector is undergoing an unprecedented transformation in 2025. The modern guest is no longer seeking just aesthetic opulence or passive relaxation, but measurable vitality and an extension of their 'healthspan'. Elite hotels are evolving into true longevity sanctuaries, integrating advanced preventive medicine into their wellness offerings.",
        "**The New Era of Luxury Medical Wellness**",
        "We are witnessing the definitive convergence between hospitality and medicine. Resorts in destinations like Switzerland, Thailand, and now Spain are incorporating full clinics led by multidisciplinary medical teams. We are no longer talking just about massages, but about molecular diagnostics, real-time biomarker analysis, and epigenetic therapies designed to reverse the biological clock.",
        "**Cutting-Edge Technologies at the Guest's Service**",
        "Among the most notable innovations are hyperbaric oxygen chambers, which saturate blood plasma to accelerate cellular regeneration and cognitive function. Whole-body cryotherapy, at temperatures of -110°C, is offered not only for athlete muscle recovery but as a potent systemic anti-inflammatory and metabolic booster. Additionally, photobiomodulation (red and infrared light) therapies are becoming standard to improve mitochondrial health while the guest rests.",
        "**Precision Nutrition and Supplementation**",
        "The culinary experience has also been redefined. Menus are no longer based solely on flavor, but on nutritional density and genetic compatibility. Through nutrigenomics testing, chefs design personalized meal plans that reduce inflammation and optimize energy. This is complemented by 'alchemy bars' serving intravenous (IV) vitamin drips and nootropics, customized according to specific deficiencies detected at check-in.",
        "**The Ultimate Goal: Biological Transformation**",
        "Luxury in 2025 is defined by the outcome: returning the guest to their daily life not just rested, but biologically optimized. Sleep programs, for example, use smart mattresses and biometric monitoring to restructure the client's sleep architecture. Ultimately, these hotels are not selling beds; they are selling years of quality life."
      ]
    }
  },
  {
    title: {
      es: "IA y la Hiper-personalización en el Wellness",
      en: "AI & Hyper-personalization in Wellness"
    },
    excerpt: {
      es: "Cómo el Big Data, la Inteligencia Artificial y los wearables están redefiniendo los tratamientos a medida, anticipando las necesidades del cliente antes de que las exprese.",
      en: "How Big Data, Artificial Intelligence, and wearables are redefining bespoke treatments, anticipating client needs before they are even expressed."
    },
    image: "/assets/new_gen/blog_ai.png",
    date: {
      es: "18 Diciembre, 2025",
      en: "December 18, 2025"
    },
    category: {
      es: "Tecnología",
      en: "Technology"
    },
    readTime: {
      es: "5 min lectura",
      en: "5 min read"
    },
    content: {
      es: [
        "La inteligencia artificial (IA) ha dejado de ser una promesa futurista para convertirse en el cerebro invisible que orquesta la experiencia perfecta en los spas de lujo de 2025. La 'talla única' ha muerto; hoy, el lujo es sinónimo de hiper-personalización basada en datos.",
        "**El Viaje del Cliente Impulsado por Datos**",
        "Desde el momento de la reserva, algoritmos predictivos analizan el historial del cliente, sus preferencias declaradas y datos biométricos compartidos (desde sus propios wearables) para diseñar itinerarios a medida. Imagina llegar a tu habitación y que la iluminación, la temperatura y la aromaterapia estén ajustadas automáticamente para contrarrestar tu jet lag específico, basándose en tus datos de vuelo y ritmo circadiano.",
        "**Diagnósticos de Precisión Clínica**",
        "En la cabina, la tecnología eleva la terapia manual. Escáneres de piel impulsados por IA analizan capas dérmicas invisibles al ojo humano, detectando daño solar, niveles de hidratación y elasticidad. Esto permite al terapeuta (o al sistema automatizado) crear mezclas de productos 'in-situ' con las concentraciones exactas de activos que la piel necesita en ese preciso instante. No es magia, es alquimia digital.",
        "**Tecnología Invisible y Empatía Aumentada**",
        "Lejos de deshumanizar el servicio, la IA actúa como un 'co-terapeuta'. Monitorea los signos vitales del cliente durante un masaje para sugerir al terapeuta cambios en la presión o el ritmo para maximizar la relajación parasimpática. Además, libera al personal de tareas administrativas, permitiéndoles centrarse en la conexión emocional. La tecnología se vuelve invisible, operando en segundo plano para que la experiencia humana brille con mayor intensidad.",
        "**El Futuro: Bienestar Predictivo**",
        "El siguiente paso es el bienestar predictivo: sistemas que no solo reaccionan a cómo te sientes, sino que anticipan cómo te sentirás. Mediante el análisis continuo de variabilidad de frecuencia cardíaca (VFC) y calidad del sueño, tu spa de confianza podrá sugerirte intervenciones preventivas antes de que aparezcan los síntomas de agotamiento o enfermedad."
      ],
      en: [
        "Artificial intelligence (AI) has moved from a futuristic promise to the invisible brain orchestrating the perfect experience in the luxury spas of 2025. 'One size fits all' is dead; today, luxury is synonymous with data-driven hyper-personalization.",
        "**The Data-Driven Guest Journey**",
        "From the moment of booking, predictive algorithms analyze the client's history, stated preferences, and shared biometric data (from their own wearables) to design bespoke itineraries. Imagine arriving at your room and having the lighting, temperature, and aromatherapy automatically adjusted to counteract your specific jet lag, based on your flight data and circadian rhythm.",
        "**Clinical Precision Diagnostics**",
        "In the treatment room, technology elevates manual therapy. AI-driven skin scanners analyze dermal layers invisible to the human eye, detecting sun damage, hydration levels, and elasticity. This allows the therapist (or automated system) to create product blends 'in-situ' with the exact concentrations of actives the skin needs at that precise moment. It's not magic, it's digital alchemy.",
        "**Invisible Technology and Augmented Empathy**",
        "Far from dehumanizing service, AI acts as a 'co-therapist'. It monitors the client's vital signs during a massage to suggest changes in pressure or rhythm to the therapist to maximize parasympathetic relaxation. Additionally, it frees staff from administrative tasks, allowing them to focus on emotional connection. Technology becomes invisible, operating in the background so the human experience shines brighter.",
        "**The Future: Predictive Wellness**",
        "The next step is predictive wellness: systems that not only react to how you feel but anticipate how you will feel. Through continuous analysis of heart rate variability (HRV) and sleep quality, your trusted spa will be able to suggest preventive interventions before symptoms of burnout or illness appear."
      ]
    }
  },
  {
    title: {
      es: "La Revolución de la Longevidad y el Biohacking",
      en: "The Longevity Revolution & Biohacking"
    },
    excerpt: {
      es: "Más allá de la relajación: cámaras hiperbáricas, crioterapia y sueros IV para optimizar la salud celular y el rendimiento cognitivo.",
      en: "Beyond relaxation: hyperbaric chambers, cryotherapy, and IV drips to optimize cellular health and cognitive performance."
    },
    image: "/attached_assets/blog_longevity_luxury_spa_v2.png",
    date: {
      es: "02 Febrero, 2025",
      en: "February 02, 2025"
    },
    category: {
      es: "Innovación",
      en: "Innovation"
    },
    readTime: {
      es: "7 min lectura",
      en: "7 min read"
    },
    content: {
      es: [
        "El término 'spa' (Salus Per Aquam) se está redefiniendo hacia 'Salus Per Scientiam'. Los clientes de alto nivel adquisitivo están impulsando la transición de la relajación hedonista hacia el 'Biohacking': el uso de ciencia y tecnología para controlar la propia biología y optimizar el rendimiento físico y mental.",
        "**El Arsenal del Biohacker en el Hotel**",
        "Las instalaciones de spa modernas parecen cada vez más laboratorios de la NASA. La **Crioterapia de Cuerpo Entero** es una de las estrellas; exposiciones breves a frío extremo provocan una cascada de endorfinas y una vasoconstricción masiva que, al liberarse, inunda los tejidos de sangre oxigenada y nutrientes. Es el 'reset' metabólico definitivo.",
        "Por otro lado, la **Oxigenación Hiperbárica (HBOT)** ofrece lo opuesto: presurizar el cuerpo para forzar la entrada de oxígeno en fluidos donde normalmente no llega, acelerando la curación de tejidos, la neuroplasticidad y combatiendo la fatiga crónica típica de los ejecutivos de alto nivel.",
        "**Sueros IV y Nutrición Celular**",
        "La suplementación oral tiene límites de absorción. Por eso, los 'Drip Lounges' son el nuevo bar de moda. Tratamientos intravenosos de NAD+ (una coenzima vital para la energía celular que disminuye con la edad), glutatión (el antioxidante maestro) y complejos vitamínicos se administran mientras el cliente disfruta de vistas al mar o una sesión de meditación guiada. El efecto es casi inmediato: claridad mental, energía renovada y una piel radiante desde el interior.",
        "**Neuro-hacking y Salud Mental**",
        "El biohacking no es solo físico. Tecnologías de neurofeedback y estimulación magnética transcraneal (TMS) suave están entrando en los spas para entrenar el cerebro hacia estados de calma profunda (ondas Alpha/Theta) o concentración máxima (ondas Beta/Gamma). Combinado con tanques de flotación privación sensorial, estas herramientas ofrecen un atajo hacia estados meditativos que normalmente requerirían años de práctica.",
        "Esta revolución marca el fin del bienestar pasivo. El huésped es ahora un participante activo e informado en la optimización de su propia máquina biológica."
      ],
      en: [
        "The term 'spa' (Salus Per Aquam) is being redefined towards 'Salus Per Scientiam'. High-net-worth clients are driving the transition from hedonistic relaxation to 'Biohacking': the use of science and technology to control one's own biology and optimize physical and mental performance.",
        "**The Biohacker's Arsenal at the Hotel**",
        "Modern spa facilities increasingly resemble NASA laboratories. **Whole-Body Cryotherapy** is one of the stars; brief exposures to extreme cold trigger an endorphin cascade and massive vasoconstriction which, upon release, floods tissues with oxygenated blood and nutrients. It is the ultimate metabolic 'reset'.",
        "On the other hand, **Hyperbaric Oxygen Therapy (HBOT)** offers the opposite: pressurizing the body to force oxygen into fluids where it normally doesn't reach, accelerating tissue healing, neuroplasticity, and combating the chronic fatigue typical of high-level executives.",
        "**IV Drips and Cellular Nutrition**",
        "Oral supplementation has absorption limits. That's why 'Drip Lounges' are the new trendy bar. Intravenous treatments of NAD+ (a vital coenzyme for cellular energy that declines with age), glutathione (the master antioxidant), and vitamin complexes are administered while the client enjoys ocean views or a guided meditation session. The effect is almost immediate: mental clarity, renewed energy, and radiant skin from the inside out.",
        "**Neuro-hacking and Mental Health**",
        "Biohacking is not just physical. Neurofeedback technologies and mild transcranial magnetic stimulation (TMS) are entering spas to train the brain towards states of deep calm (Alpha/Theta waves) or peak focus (Beta/Gamma waves). Combined with sensory deprivation float tanks, these tools offer a shortcut to meditative states that would normally require years of practice.",
        "This revolution marks the end of passive wellness. The guest is now an active and informed participant in the optimization of their own biological machine."
      ]
    }
  },
  {
    title: {
      es: "Eco-Lujo: Sostenibilidad como Estándar Premium",
      en: "Eco-Luxury: Sustainability as a Premium Standard"
    },
    excerpt: {
      es: "Por qué los spas de lujo están liderando la 'Blue Beauty', eliminando plásticos y adoptando la arquitectura bioclimática para un bienestar consciente.",
      en: "Why luxury spas are leading 'Blue Beauty', eliminating plastics, and adopting bioclimatic architecture for conscious wellness."
    },
    image: "/assets/new_gen/blog_eco.png",
    date: {
      es: "20 Febrero, 2025",
      en: "February 20, 2025"
    },
    category: {
      es: "Sostenibilidad",
      en: "Sustainability"
    },
    readTime: {
      es: "5 min lectura",
      en: "5 min read"
    },
    content: {
      es: [
        "En 2025, la ostentación derrochadora ha sido reemplazada por el lujo consciente. El 'Eco-Lujo' establece que no puede haber bienestar personal si es a costa del bienestar planetario. Los spas más exclusivos del mundo están demostrando que la sostenibilidad extrema y el confort supremo no son mutuamente excluyentes, sino sinérgicos.",
        "**Blue Beauty y la Protección de los Océanos**",
        "Más allá de la 'Green Beauty', la tendencia dominante es la 'Blue Beauty': cosmética diseñada para minimizar el impacto en la vida marina. Los spas de resorts costeros están eliminando filtros solares tóxicos (como la oxibenzona) y utilizando exfoliantes a base de sal o semillas, desterrando para siempre los microplásticos. Además, marcas de lujo están utilizando envases hechos de plásticos recuperados del océano, cerrando el círculo de residuos.",
        "**Arquitectura Bioclimática y Espacios Vivos**",
        "El edificio del spa ya no es una caja climatizada artificialmente. La arquitectura bioclimática utiliza la orientación solar, la ventilación cruzada natural y materiales térmicos locales (como piedra y madera certificada) para reducir drásticamente la huella de carbono. El diseño biofílico —integrar muros vegetales, luz natural cenital y vistas ininterrumpidas a la naturaleza— no es solo estético; está probado que reduce los niveles de cortisol y mejora la recuperación del huésped.",
        "**Cero Residuos y Economía Circular**",
        "El desperdicio es el enemigo del lujo moderno. Los spas están adoptando políticas de 'Cero Residuos': desde zapatillas de spa biodegradables o lavables hasta la eliminación total de botellas de agua de plástico en favor de sistemas de filtración de agua mineralizada in-situ. Los textiles son de lino orgánico o bambú, que requieren menos agua y pesticidas que el algodón convencional.",
        "**Ética y Comunidad Local**",
        "Finalmente, el eco-lujo abarca lo social. Los tratamientos 'Signature' ahora destacan ingredientes autóctonos (Km 0), apoyando a cooperativas de agricultores locales y preservando tradiciones curativas ancestrales. El lujo se convierte así en un vehículo para la regeneración cultural y ambiental, ofreciendo al huésped una conexión auténtica y respetuosa con el destino."
      ],
      en: [
        "In 2025, wasteful ostentation has been replaced by conscious luxury. 'Eco-Luxury' establishes that personal wellness cannot come at the cost of planetary wellness. The world's most exclusive spas are demonstrating that extreme sustainability and supreme comfort are not mutually exclusive, but synergistic.",
        "**Blue Beauty and Ocean Protection**",
        "Beyond 'Green Beauty', the dominant trend is 'Blue Beauty': cosmetics designed to minimize impact on marine life. Coastal resort spas are eliminating toxic sunscreens (like oxybenzone) and using salt or seed-based scrubs, banishing microplastics forever. Furthermore, luxury brands are using packaging made from ocean-recovered plastics, closing the waste loop.",
        "**Bioclimatic Architecture and Living Spaces**",
        "The spa building is no longer an artificially climatized box. Bioclimatic architecture uses solar orientation, natural cross-ventilation, and local thermal materials (like stone and certified wood) to drastically reduce the carbon footprint. Biophilic design—integrating plant walls, overhead natural light, and uninterrupted views of nature—is not just aesthetic; it is proven to reduce cortisol levels and enhance guest recovery.",
        "**Zero Waste and Circular Economy**",
        "Waste is the enemy of modern luxury. Spas are adopting 'Zero Waste' policies: from biodegradable or washable spa slippers to the total elimination of plastic water bottles in favor of in-situ mineralized water filtration systems. Textiles are organic linen or bamboo, requiring less water and pesticides than conventional cotton.",
        "**Ethics and Local Community**",
        "Finally, eco-luxury embraces the social aspect. 'Signature' treatments now highlight indigenous ingredients (0 Km), supporting local farmer cooperatives and preserving ancestral healing traditions. Luxury thus becomes a vehicle for cultural and environmental regeneration, offering the guest an authentic and respectful connection with the destination."
      ]
    }
  },
  {
    title: {
      es: "Bienestar Mental y Mindfulness Integrado",
      en: "Mental Wellness & Integrated Mindfulness"
    },
    excerpt: {
      es: "La fusión de terapias tradicionales con prácticas de meditación y respiración para una salud holística.",
      en: "Merging traditional therapies with meditation and breathwork for holistic health."
    },
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: {
      es: "05 Marzo, 2025",
      en: "March 05, 2025"
    },
    category: {
      es: "Mindfulness",
      en: "Mindfulness"
    },
    readTime: {
      es: "6 min lectura",
      en: "6 min read"
    },
    content: {
      es: [
        "La salud mental ha tomado el protagonismo en el bienestar global. Los spas están respondiendo integrando prácticas de mindfulness y gestión del estrés directamente en sus menús de tratamientos tradicionales.",
        "Ya no se trata solo de un masaje relajante, sino de una experiencia que combina técnicas manuales con respiración guiada (Breathwork) y meditación. Los terapeutas están siendo formados para guiar a los clientes hacia estados de relajación profunda del sistema nervioso, no solo muscular.",
        "Los baños de sonido (Sound Baths) con cuencos tibetanos o gongs, y las sesiones de flotación en tanques de privación sensorial, son cada vez más populares como herramientas para desconectar la mente. El spa se convierte así en un santuario para la salud mental, ofreciendo un refugio seguro contra la sobreestimulación digital y el estrés crónico."
      ],
      en: [
        "Mental health has taken center stage in global wellness. Spas are responding by integrating mindfulness and stress management practices directly into their traditional treatment menus.",
        "It is no longer just about a relaxing massage, but an experience that combines manual techniques with guided breathing (Breathwork) and meditation. Therapists are being trained to guide clients into states of deep nervous system relaxation, not just muscular.",
        "Sound Baths with Tibetan bowls or gongs, and flotation sessions in sensory deprivation tanks, are becoming increasingly popular as tools to disconnect the mind. The spa thus becomes a sanctuary for mental health, offering a safe haven against digital overstimulation and chronic stress."
      ]
    }
  },
  {
    title: {
      es: "Menopausia: Adaptando el Spa a la Salud Hormonal",
      en: "Menopause: Adapting the Spa to Hormonal Health"
    },
    excerpt: {
      es: "Nuevos protocolos y retiros diseñados específicamente para apoyar a las mujeres en esta etapa vital.",
      en: "New protocols and retreats designed specifically to support women during this vital stage."
    },
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: {
      es: "12 Marzo, 2025",
      en: "March 12, 2025"
    },
    category: {
      es: "Salud Femenina",
      en: "Women's Health"
    },
    readTime: {
      es: "5 min lectura",
      en: "5 min read"
    },
    content: {
      es: [
        "Históricamente ignorada, la menopausia está siendo finalmente reconocida como una etapa vital que requiere atención especializada en el mundo del wellness. Los spas están creando programas específicos para apoyar a las mujeres durante el perimenopausia y la menopausia.",
        "Estos programas incluyen tratamientos para aliviar síntomas como los sofocos, el insomnio y los cambios en la piel, utilizando productos con fitoestrógenos y técnicas de enfriamiento. Pero también abordan el bienestar emocional, ofreciendo círculos de mujeres y talleres educativos.",
        "La adaptación de las instalaciones, con control de temperatura individualizado en las cabinas y opciones de ropa de cama transpirable, demuestra una comprensión profunda de las necesidades fisiológicas. Es un movimiento hacia un wellness más inclusivo y empático que celebra y apoya a la mujer en todas sus etapas."
      ],
      en: [
        "Historically ignored, menopause is finally being recognized as a vital stage requiring specialized attention in the wellness world. Spas are creating specific programs to support women during perimenopause and menopause.",
        "These programs include treatments to alleviate symptoms such as hot flashes, insomnia, and skin changes, using products with phytoestrogens and cooling techniques. But they also address emotional well-being, offering women's circles and educational workshops.",
        "Adapting facilities, with individualized temperature control in treatment rooms and breathable bedding options, demonstrates a deep understanding of physiological needs. It is a movement towards a more inclusive and empathetic wellness that celebrates and supports women in all their stages."
      ]
    }
  },
  {
    title: {
      es: "Efecto WOW: Redefiniendo la Experiencia de Lujo en Spas",
      en: "WOW Effect: Redefining the Luxury Spa Experience"
    },
    excerpt: {
      es: "Descubre cómo la personalización extrema, la tecnología inmersiva y el diseño sensorial crean momentos inolvidables que fidelizan al cliente más exigente.",
      en: "Discover how extreme personalization, immersive technology, and sensory design create unforgettable moments that build loyalty with the most demanding clients."
    },
    image: "/attached_assets/blog_wow_effect_spa.png",
    date: {
      es: "20 Diciembre, 2025",
      en: "December 20, 2025"
    },
    category: {
      es: "Tendencias",
      en: "Trends"
    },
    readTime: {
      es: "6 min lectura",
      en: "6 min read"
    },
    content: {
      es: [
        "En el competitivo mundo del bienestar de lujo, la excelencia técnica ya no es suficiente. El cliente de hoy busca emoción, sorpresa y una conexión profunda. Esto es el 'Efecto WOW': esa fracción de segundo en la que las expectativas no solo se cumplen, sino que se pulverizan, dejando una huella emocional indeleble.",
        "**La Personalización Radical como Norma**",
        "El verdadero lujo es sentirse único. El 'Efecto WOW' comienza mucho antes de que el cliente cruce la puerta. Sistemas de CRM avanzados e Inteligencia Artificial permiten anticipar deseos no expresados: desde la temperatura preferida de la camilla hasta la selección musical basada en el estado de ánimo actual del huésped. No es magia, es empatía amplificada por datos.",
        "**Arquitectura de los Sentidos**",
        "Los spas más impactantes de 2025 son obras maestras de diseño sensorial. Hablamos de espacios de transición inmersivos donde la iluminación circadiana, aromas de diseño molecular y paisajes sonoros biófilos preparan el sistema nervioso para la terapia. El diseño ya no es estático; respira y se adapta al usuario, creando una atmósfera que envuelve y transporta.",
        "**Tecnología que Humaniza**",
        "Lejos de ser fría, la tecnología bien aplicada intensifica la calidez del servicio. Desde 'espejos mágicos' que analizan la piel y proyectan los resultados en tiempo real, hasta tumbonas de gravedad cero con terapia vibroacústica. El 'WOW' surge cuando la innovación tecnológica resuelve una necesidad de bienestar de una manera que el cliente nunca imaginó posible.",
        "**El Factor Humano: La Última Frontera**",
        "Sin embargo, la tecnología y el diseño son solo el escenario. El verdadero protagonista del 'Efecto WOW' es el terapeuta. Profesionales empoderados con inteligencia emocional, capaces de leer el lenguaje no verbal y adaptar cada movimiento, cada palabra, al momento presente. Cuando la intuición humana se encuentra con la excelencia operativa, se crea la magia pura."
      ],
      en: [
        "In the competitive world of luxury wellness, technical excellence is no longer enough. Today's client seeks emotion, surprise, and a deep connection. This is the 'WOW Effect': that fraction of a second when expectations are not just met, but shattered, leaving an indelible emotional mark.",
        "**Radical Personalization as the Norm**",
        "True luxury is feeling unique. The 'WOW Effect' begins long before the client walks through the door. Advanced CRM systems and Artificial Intelligence allow anticipating unexpressed desires: from the preferred treatment bed temperature to a music selection based on the guest's current mood. It's not magic, it's empathy amplified by data.",
        "**Architecture of the Senses**",
        "The most impactful spas of 2025 are masterpieces of sensory design. We are talking about immersive transition spaces where circadian lighting, molecular designer scents, and biophilic soundscapes prepare the nervous system for therapy. Design is no longer static; it breathes and adapts to the user, creating an atmosphere that envelops and transports.",
        "**Technology that Humanizes**",
        "Far from being cold, well-applied technology intensifies the warmth of service. From 'magic mirrors' that analyze skin and project results in real-time, to zero-gravity loungers with vibroacoustic therapy. The 'WOW' emerges when technological innovation solves a wellness need in a way the client never imagined possible.",
        "**The Human Factor: The Final Frontier**",
        "However, technology and design are just the stage. The true protagonist of the 'WOW Effect' is the therapist. Professionals empowered with emotional intelligence, capable of reading non-verbal language and adapting every movement, every word, to the present moment. When human intuition meets operational excellence, pure magic is created."
      ]
    }
  }
];
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const Resources = ({ isPage = false }) => {
  const { t, language } = useLanguage();
  const [selectedResource, setSelectedResource] = useState(null);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  const TitleTag = isPage ? "h1" : "h2";
  const SubtitleTag = isPage ? "h2" : "h3";
  return /* @__PURE__ */ jsx("section", { className: `py-16 md:py-24 bg-white ${isPage ? "pt-32" : ""}`, children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "text-center max-w-3xl mx-auto mb-16",
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx(TitleTag, { className: "text-sm uppercase tracking-wider text-turquoise font-medium mb-3", children: t("resources.title") }),
          /* @__PURE__ */ jsx(SubtitleTag, { className: "font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6", children: t("resources.subtitle") }),
          /* @__PURE__ */ jsx("p", { className: "text-charcoal-light", children: language === "es" ? "Accede a guías y recursos exclusivos para optimizar la gestión de tu spa. Lectura directa y práctica." : "Access exclusive guides and resources to optimize your spa management. Direct and practical reading." })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "grid grid-cols-1 md:grid-cols-3 gap-8",
        variants: containerVariants,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true },
        children: resources.map((resource, index) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover-scale flex flex-col h-full cursor-pointer group",
            variants: itemVariants,
            onClick: () => setSelectedResource(resource),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "relative h-48 overflow-hidden", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: resource.image,
                    alt: typeof resource.title === "object" ? resource.title[language] : resource.title,
                    className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col flex-grow", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-playfair text-xl font-bold text-charcoal mb-2", children: typeof resource.title === "object" ? resource.title[language] : resource.title }),
                /* @__PURE__ */ jsx("p", { className: "text-charcoal-light text-sm mb-4 flex-grow", children: typeof resource.description === "object" ? resource.description[language] : resource.description }),
                /* @__PURE__ */ jsx("div", { className: "mt-auto", children: /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "inline-block w-full bg-turquoise hover:bg-turquoise-dark text-white text-center font-medium py-2 rounded transition-colors",
                    children: typeof resource.buttonText === "object" ? resource.buttonText[language] : resource.buttonText
                  }
                ) })
              ] })
            ]
          },
          index
        ))
      }
    ),
    /* @__PURE__ */ jsx(Dialog, { open: !!selectedResource, onOpenChange: (open) => !open && setSelectedResource(null), children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0", children: selectedResource && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "relative h-64 w-full", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: selectedResource.image,
            alt: "Resource header",
            className: "w-full h-full object-cover"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedResource(null),
            className: "absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors z-10",
            "aria-label": "Close",
            children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white", children: /* @__PURE__ */ jsx(DialogTitle, { className: "font-playfair text-2xl md:text-3xl font-bold leading-tight", children: typeof selectedResource.title === "object" ? selectedResource.title[language] : selectedResource.title }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6 md:p-8", children: /* @__PURE__ */ jsx("div", { className: "prose prose-lg prose-headings:font-playfair prose-headings:text-charcoal prose-p:text-charcoal-light prose-li:text-charcoal-light max-w-none", children: /* @__PURE__ */ jsx(ReactMarkdown, { children: Array.isArray(selectedResource.content[language]) ? selectedResource.content[language].join("\n\n") : selectedResource.content[language] }) }) })
    ] }) }) })
  ] }) });
};
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const { toast: toast2 } = useToast();
  const {
    data: user,
    error,
    isLoading
  } = useQuery({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" })
  });
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      return await apiRequest({
        method: "POST",
        path: "/api/login",
        body: credentials
      });
    },
    onSuccess: (user2) => {
      queryClient.setQueryData(["/api/user"], user2);
    },
    onError: (error2) => {
      toast2({
        title: "Error al iniciar sesión",
        description: error2.message,
        variant: "destructive"
      });
    }
  });
  const registerMutation = useMutation({
    mutationFn: async (credentials) => {
      return await apiRequest({
        method: "POST",
        path: "/api/register",
        body: credentials
      });
    },
    onSuccess: (user2) => {
      queryClient.setQueryData(["/api/user"], user2);
    },
    onError: (error2) => {
      toast2({
        title: "Error en el registro",
        description: error2.message,
        variant: "destructive"
      });
    }
  });
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest({
        method: "POST",
        path: "/api/logout"
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
    },
    onError: (error2) => {
      toast2({
        title: "Error al cerrar sesión",
        description: error2.message,
        variant: "destructive"
      });
    }
  });
  return /* @__PURE__ */ jsx(
    AuthContext.Provider,
    {
      value: {
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation
      },
      children
    }
  );
}
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
function ProtectedRoute({
  path,
  component: Component2
}) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return /* @__PURE__ */ jsx(Route, { path, children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-border" }) }) });
  }
  if (!user) {
    return /* @__PURE__ */ jsx(Route, { path, children: /* @__PURE__ */ jsx(Redirect, { to: "/auth" }) });
  }
  return /* @__PURE__ */ jsx(Route, { path, component: Component2 });
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const GTM_ID = "GTM-KGMBTXN2";
function updateConsent(granted) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(...args) {
    window.dataLayer.push(args);
  };
  window.gtag("consent", "update", {
    ad_storage: granted ? "granted" : "denied",
    analytics_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied"
  });
}
function loadGoogleTagManager() {
  if (document.querySelector(`script[data-gtm-id="${GTM_ID}"]`)) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.dataset.gtmId = GTM_ID;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
}
function trackEvent(event, parameters = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    page_path: window.location.pathname,
    ...parameters
  });
}
const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const { language } = useLanguage();
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent === "accepted" || consent === "true") {
      localStorage.setItem("cookieConsent", "accepted");
      updateConsent(true);
      loadGoogleTagManager();
      return;
    }
    if (!consent) {
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);
  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    updateConsent(true);
    loadGoogleTagManager();
    setShowConsent(false);
  };
  const rejectCookies = () => {
    localStorage.setItem("cookieConsent", "rejected");
    updateConsent(false);
    setShowConsent(false);
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: showConsent && /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 100, opacity: 0 },
      transition: { duration: 0.5 },
      className: "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4",
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex flex-col md:flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4 md:mb-0 md:mr-8 text-center md:text-left", children: /* @__PURE__ */ jsxs("p", { className: "text-charcoal text-sm md:text-base", children: [
          language === "es" ? "Utilizamos cookies para mejorar tu experiencia. Al continuar navegando en nuestra web, aceptas nuestra " : "We use cookies to enhance your experience. By continuing to browse our site, you agree to our ",
          /* @__PURE__ */ jsx(Link, { href: "/cookies", className: "text-turquoise hover:underline", children: language === "es" ? "política de cookies" : "cookie policy" }),
          "."
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: rejectCookies,
              className: "border-gray-300 text-charcoal hover:bg-gray-100 hover:text-charcoal",
              children: language === "es" ? "Rechazar" : "Reject"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              onClick: acceptCookies,
              className: "bg-turquoise hover:bg-turquoise-dark text-white",
              children: language === "es" ? "Aceptar" : "Accept"
            }
          )
        ] })
      ] })
    }
  ) });
};
function useChatbot() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const welcomeMessage = t("chatbot.welcome");
    setMessages([
      { role: "assistant", content: welcomeMessage }
    ]);
  }, [language, t]);
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    input.trim();
    setInput("");
    setIsLoading(true);
    try {
      const chatResponse = await apiRequest({
        path: "/api/chat",
        method: "POST",
        body: { messages: [...messages, userMessage].filter((m) => m.role !== "system") }
      });
      if (chatResponse && chatResponse.response) {
        setMessages((prev) => [...prev, chatResponse.response]);
      } else {
        throw new Error("No se recibió respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al comunicarse con el chatbot:", error);
      const errorMessage = `${t("chatbot.error")} (${error instanceof Error ? error.message : String(error)})`;
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    isOpen,
    setIsOpen,
    messages,
    input,
    setInput,
    isLoading,
    sendMessage
  };
}
const ChatBot = () => {
  const { language, t } = useLanguage();
  const {
    isOpen,
    setIsOpen,
    messages,
    input,
    setInput,
    isLoading,
    sendMessage
  } = useChatbot();
  const chatContainerRef = useRef(null);
  const hasTrackedOpen = useRef(false);
  const openChat = (source) => {
    if (!hasTrackedOpen.current) {
      trackEvent("chat_start", { source, language });
      hasTrackedOpen.current = true;
    }
    setIsOpen(true);
  };
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const placeholderText = String(t("chatbot.placeholder"));
  const sendButtonText = t("chatbot.send");
  const chatTitle = t("chatbot.title");
  const loadingText = t("chatbot.typing");
  const subtitle = t("chatbot.subtitle");
  const suggestionsText = t("chatbot.suggestions");
  return /* @__PURE__ */ jsxs("div", { id: "chatbot-container", className: "relative", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "fixed bottom-6 right-6 z-50 flex flex-col items-end",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 1 },
        children: [
          !isOpen && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg p-3 mb-3 max-w-[200px] text-sm hidden md:block", children: [
            /* @__PURE__ */ jsx("p", { className: "text-charcoal font-medium", children: language === "es" ? "¿Necesitas ayuda con tu proyecto wellness?" : "Need help with your wellness project?" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "text-turquoise text-xs mt-1 hover:underline",
                onClick: () => openChat("prompt"),
                children: language === "es" ? "Chatea conmigo" : "Chat with me"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            motion.button,
            {
              className: "bg-turquoise text-white rounded-full p-4 shadow-lg flex items-center justify-center",
              whileHover: { scale: 1.1 },
              whileTap: { scale: 0.9 },
              onClick: () => openChat("floating_button"),
              "aria-label": language === "es" ? "Abrir chat" : "Open chat",
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "24",
                  height: "24",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: /* @__PURE__ */ jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
                }
              )
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "bg-white rounded-lg shadow-xl w-full max-w-md h-[600px] max-h-[80vh] flex flex-col",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-turquoise text-white p-4 rounded-t-lg flex justify-between items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3", children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                /* @__PURE__ */ jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7", r: "4" })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-medium text-white", children: chatTitle }),
                /* @__PURE__ */ jsx("p", { className: "text-white/70 text-xs", children: subtitle })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setIsOpen(false),
                className: "text-white hover:text-white/80 transition-colors",
                "aria-label": language === "es" ? "Cerrar chat" : "Close chat",
                children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                  /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: chatContainerRef,
              className: "flex-1 p-4 overflow-y-auto space-y-4",
              children: [
                messages.map((msg, i) => /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
                    children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `rounded-lg p-3 max-w-[80%] ${msg.role === "user" ? "bg-sage/20 text-charcoal" : "bg-turquoise text-white"}`,
                        children: msg.content
                      }
                    )
                  },
                  i
                )),
                isLoading && /* @__PURE__ */ jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsx("div", { className: "bg-gray-100 text-gray-500 rounded-lg p-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce" }),
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: "0.2s" } }),
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: "0.4s" } }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm ml-2", children: loadingText })
                ] }) }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "px-4 pt-2 pb-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mb-2", children: suggestionsText }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-3", children: [
              language === "es" ? "¿Cómo aumentar ingresos en mi spa?" : "How to increase spa revenue?",
              language === "es" ? "¿Qué tendencias wellness hay?" : "Current wellness trends?",
              language === "es" ? "¿Cómo formar a mi equipo?" : "How to train my team?"
            ].map((suggestion, i) => /* @__PURE__ */ jsx(
              "button",
              {
                className: "text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors",
                onClick: () => setInput(suggestion),
                children: suggestion
              },
              i
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-gray-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  className: "flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-turquoise resize-none",
                  placeholder: placeholderText,
                  value: input,
                  onChange: (e) => setInput(e.target.value),
                  onKeyDown: handleKeyPress,
                  rows: 1,
                  disabled: isLoading
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  className: "rounded-l-none bg-turquoise hover:bg-turquoise/90",
                  onClick: sendMessage,
                  disabled: isLoading || !input.trim(),
                  children: [
                    /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "mr-0 md:mr-2", children: [
                      /* @__PURE__ */ jsx("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
                      /* @__PURE__ */ jsx("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: sendButtonText })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs text-center text-gray-500", children: /* @__PURE__ */ jsx("p", { children: t("chatbot.disclaimer") }) })
          ] })
        ]
      }
    ) }) })
  ] });
};
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isVisible && /* @__PURE__ */ jsx(
    motion.button,
    {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      onClick: scrollToTop,
      className: "fixed bottom-4 left-4 md:bottom-8 md:left-8 z-50 p-3 bg-turquoise text-white rounded-full shadow-lg hover:bg-turquoise-dark transition-colors focus:outline-none focus:ring-2 focus:ring-turquoise focus:ring-offset-2",
      "aria-label": "Scroll to top",
      children: /* @__PURE__ */ jsx(FaArrowUp, { size: 20 })
    }
  ) });
};
function PageLoader() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background/80 mobile-safe-area", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "h-12 w-12 animate-spin text-primary" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground animate-pulse text-sm font-medium", children: "Cargando experiencia..." })
  ] }) });
}
const Home$2 = React__default.lazy(() => Promise.resolve().then(() => Home$1));
const Privacy$2 = React__default.lazy(() => Promise.resolve().then(() => Privacy$1));
const Terms$2 = React__default.lazy(() => Promise.resolve().then(() => Terms$1));
const Cookies$2 = React__default.lazy(() => Promise.resolve().then(() => Cookies$1));
const Booking$2 = React__default.lazy(() => Promise.resolve().then(() => Booking$1));
const Admin$2 = React__default.lazy(() => Promise.resolve().then(() => Admin$1));
const AuthPage$1 = React__default.lazy(() => Promise.resolve().then(() => Auth));
const BlogPostPage$2 = React__default.lazy(() => Promise.resolve().then(() => BlogPostPage$1));
function Router() {
  const [location] = useLocation();
  return /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(PageLoader, {}), children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(Switch, { location, children: [
    /* @__PURE__ */ jsx(Route, { path: "/", children: /* @__PURE__ */ jsx(Home$2, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/privacy", children: /* @__PURE__ */ jsx(Privacy$2, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/terms", children: /* @__PURE__ */ jsx(Terms$2, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/cookies", children: /* @__PURE__ */ jsx(Cookies$2, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/booking", children: /* @__PURE__ */ jsx(Booking$2, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/auth", children: /* @__PURE__ */ jsx(AuthPage$1, {}) }),
    /* @__PURE__ */ jsx(ProtectedRoute, { path: "/admin", component: Admin$2 }),
    /* @__PURE__ */ jsx(Route, { path: "/resources", children: /* @__PURE__ */ jsx(Resources, { isPage: true }) }),
    /* @__PURE__ */ jsx(Route, { path: "/blog/:slug", component: BlogPostPage$2 }),
    /* @__PURE__ */ jsx(Route, { component: NotFound })
  ] }, location) }) });
}
function App({ queryClient: propsClient }) {
  const client = propsClient || queryClient;
  return /* @__PURE__ */ jsx(QueryClientProvider, { client, children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsxs(LanguageProvider, { children: [
    /* @__PURE__ */ jsx(Router, {}),
    /* @__PURE__ */ jsx(ChatBot, {}),
    /* @__PURE__ */ jsx(CookieConsent, {}),
    /* @__PURE__ */ jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsx(Toaster, {})
  ] }) }) });
}
function seedQueryClient(queryClient2, initialData) {
  if (!initialData) return;
  if (initialData.articles) {
    queryClient2.setQueryData(["/api/articles"], initialData.articles);
  }
  if (initialData.article && initialData.articleSlug) {
    queryClient2.setQueryData(
      [`/api/articles/${initialData.articleSlug}`],
      initialData.article
    );
  }
}
function render(url, initialData = {}) {
  const queryClient2 = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: async () => {
          throw new Error("Missing preloaded data for an SSR query");
        },
        staleTime: Infinity,
        retry: false
      }
    }
  });
  seedQueryClient(queryClient2, initialData);
  queryClient2.setQueryData(["/api/user"], null);
  const helmetContext = {};
  const app = /* @__PURE__ */ jsx(HelmetProvider, { context: helmetContext, children: /* @__PURE__ */ jsx(Router$1, { ssrPath: url, children: /* @__PURE__ */ jsx(App, { queryClient: queryClient2 }) }) });
  return new Promise((resolve, reject) => {
    let settled = false;
    let timeout;
    const output = new PassThrough();
    const chunks = [];
    const finishWithError = (error) => {
      if (settled) return;
      settled = true;
      if (timeout) clearTimeout(timeout);
      queryClient2.clear();
      reject(error instanceof Error ? error : new Error(String(error)));
    };
    output.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    output.on("error", finishWithError);
    output.on("end", () => {
      if (settled) return;
      settled = true;
      if (timeout) clearTimeout(timeout);
      const html = Buffer.concat(chunks).toString("utf-8");
      queryClient2.clear();
      resolve({ html, helmetContext });
    });
    const stream = renderToPipeableStream(app, {
      onAllReady() {
        stream.pipe(output);
      },
      onShellError: finishWithError,
      onError(error) {
        console.error("SSR render error:", error);
      }
    });
    timeout = setTimeout(() => {
      stream.abort();
      finishWithError(new Error("SSR render timed out"));
    }, 15e3);
  });
}
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98
  }
};
const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};
const PageTransition = ({ children }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: "initial",
      animate: "in",
      exit: "out",
      variants: pageVariants,
      transition: pageTransition,
      className: "w-full",
      children
    }
  );
};
const evaProfileImage = "/assets/hero-es-kbcuNBxT.png";
const spainFlag = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%3e%3crect%20width='32'%20height='32'%20fill='%23F1BF00'%20/%3e%3crect%20width='32'%20height='8'%20fill='%23AA151B'%20y='0'%20/%3e%3crect%20width='32'%20height='8'%20fill='%23AA151B'%20y='24'%20/%3e%3c/svg%3e";
const ukFlag = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%3e%3crect%20width='32'%20height='32'%20fill='%23012169'/%3e%3cpath%20d='M0,0%20L32,32%20M32,0%20L0,32'%20stroke='%23fff'%20stroke-width='4'/%3e%3cpath%20d='M16,0%20L16,32%20M0,16%20L32,16'%20stroke='%23fff'%20stroke-width='8'/%3e%3cpath%20d='M16,0%20L16,32%20M0,16%20L32,16'%20stroke='%23C8102E'%20stroke-width='4'/%3e%3cpath%20d='M0,0%20L32,32%20M32,0%20L0,32'%20stroke='%23C8102E'%20stroke-width='2'/%3e%3c/svg%3e";
const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        className: `w-8 h-8 flex items-center justify-center rounded-full overflow-hidden ${language === "es" ? "ring-2 ring-turquoise" : "ring-1 ring-gray-300"} hover:ring-2 hover:ring-turquoise transition-all`,
        onClick: () => setLanguage("es"),
        "aria-label": "Cambiar a español",
        children: /* @__PURE__ */ jsx("img", { src: spainFlag, alt: "Bandera de España", className: "w-full h-full object-cover" })
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: `w-8 h-8 flex items-center justify-center rounded-full overflow-hidden ${language === "en" ? "ring-2 ring-turquoise" : "ring-1 ring-gray-300"} hover:ring-2 hover:ring-turquoise transition-all`,
        onClick: () => setLanguage("en"),
        "aria-label": "Switch to English",
        children: /* @__PURE__ */ jsx("img", { src: ukFlag, alt: "UK Flag", className: "w-full h-full object-cover" })
      }
    )
  ] });
};
function useDeviceDetect() {
  const [deviceType, setDeviceType] = useState("desktop");
  useEffect(() => {
    const handleResize = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
      const isMobileDevice = mobileRegex.test(userAgent.toLowerCase());
      const width = window.innerWidth;
      if (isMobileDevice && width < 768) {
        setDeviceType("mobile");
      } else if (isMobileDevice || width >= 768 && width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return {
    deviceType,
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop"
  };
}
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, language } = useLanguage();
  const { isMobile, isTablet } = useDeviceDetect();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  return /* @__PURE__ */ jsxs(
    "header",
    {
      id: "navbar",
      className: `fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 transition-all duration-300 ${isMobile ? scrolled ? "py-1.5" : "py-2" : isTablet ? scrolled ? "py-2" : "py-3" : scrolled ? "py-2.5" : "py-4"}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: `container mx-auto ${isMobile ? "px-3" : isTablet ? "px-5" : "px-8"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs("a", { href: "#", className: "flex items-center", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: evaProfileImage,
                alt: "Eva Pérez",
                className: `rounded-full object-cover flex-shrink-0 ${isMobile ? "h-7 w-7 mr-2" : isTablet ? "h-9 w-9 mr-2.5" : "h-11 w-11 mr-3"}`
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: `font-playfair font-bold text-turquoise block leading-tight ${isMobile ? "text-base" : isTablet ? "text-xl" : "text-2xl"}`, children: "Eva Pérez" }),
              /* @__PURE__ */ jsx("span", { className: `text-sage-dark font-light ${isMobile ? "text-[8px] whitespace-normal leading-tight max-w-[220px]" : "text-xs"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: language === "es" ? "Gerente de Proyectos SPA & Wellness" : "SPA & Wellness Project Manager" }),
                /* @__PURE__ */ jsx("span", { className: "hidden md:inline text-turquoise/60", children: "|" }),
                /* @__PURE__ */ jsx("span", { children: language === "es" ? "Especialista en Optimización de Ingresos" : "Revenue Optimization Specialist" })
              ] }) })
            ] })
          ] }),
          !isMobile && /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center", children: [
            /* @__PURE__ */ jsxs("nav", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#about",
                  className: `text-charcoal hover:text-turquoise transition-colors ${isTablet ? "text-xs px-2" : "text-sm px-3"}`,
                  children: t("header.about")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#services",
                  className: `text-charcoal hover:text-turquoise transition-colors ${isTablet ? "text-xs px-2" : "text-sm px-3"}`,
                  children: t("header.services")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#portfolio",
                  className: `text-charcoal hover:text-turquoise transition-colors ${isTablet ? "text-xs px-2" : "text-sm px-3"}`,
                  children: t("header.portfolio")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#testimonials",
                  className: `text-charcoal hover:text-turquoise transition-colors ${isTablet ? "text-xs px-2" : "text-sm px-3"}`,
                  children: t("header.testimonials")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#blog",
                  className: `text-charcoal hover:text-turquoise transition-colors ${isTablet ? "text-xs px-2" : "text-sm px-3"}`,
                  children: t("header.blog")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#contact",
                  "data-analytics-cta": "request_audit",
                  "data-analytics-location": "header_desktop",
                  className: `bg-turquoise text-white rounded hover:bg-turquoise-dark transition-colors ${isTablet ? "text-xs px-3 py-1.5 ml-1" : "text-sm px-4 py-2 ml-2"}`,
                  children: t("header.bookAudit")
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: isTablet ? "ml-2" : "ml-4", children: /* @__PURE__ */ jsx(LanguageSwitcher, {}) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "md:hidden focus:outline-none p-1.5",
              onClick: toggleMobileMenu,
              "aria-label": "Toggle mobile menu",
              children: /* @__PURE__ */ jsx("i", { className: `fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} ${isMobile ? "text-lg" : "text-xl"} text-charcoal` })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `md:hidden bg-white w-full border-t border-gray-100 absolute left-0 right-0 z-[60] shadow-md transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden pointer-events-none"}`,
            children: /* @__PURE__ */ jsxs("div", { className: `container mx-auto ${isMobile ? "px-3 py-3 space-y-2" : "px-4 py-4 space-y-3"}`, children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#about",
                  className: `block text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors ${isMobile ? "py-2 text-sm" : "py-3"}`,
                  onClick: toggleMobileMenu,
                  children: t("header.about")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#services",
                  className: `block text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors ${isMobile ? "py-2 text-sm" : "py-3"}`,
                  onClick: toggleMobileMenu,
                  children: t("header.services")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#portfolio",
                  className: `block text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors ${isMobile ? "py-2 text-sm" : "py-3"}`,
                  onClick: toggleMobileMenu,
                  children: t("header.portfolio")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#testimonials",
                  className: `block text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors ${isMobile ? "py-2 text-sm" : "py-3"}`,
                  onClick: toggleMobileMenu,
                  children: t("header.testimonials")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#blog",
                  className: `block text-charcoal hover:text-turquoise border-b border-gray-100 active:bg-gray-50 transition-colors ${isMobile ? "py-2 text-sm" : "py-3"}`,
                  onClick: toggleMobileMenu,
                  children: t("header.blog")
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#contact",
                  "data-analytics-cta": "request_audit",
                  "data-analytics-location": "header_mobile",
                  className: `block text-turquoise font-medium border-b border-gray-100 active:bg-gray-50 transition-colors ${isMobile ? "py-2 text-sm" : "py-3"}`,
                  onClick: toggleMobileMenu,
                  children: t("header.bookAudit")
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between ${isMobile ? "py-2" : "py-3"}`, children: [
                /* @__PURE__ */ jsx("span", { className: `text-gray-500 ${isMobile ? "text-xs" : "text-sm"}`, children: language === "es" ? "Idioma" : "Language" }),
                /* @__PURE__ */ jsx(LanguageSwitcher, {})
              ] })
            ] })
          }
        )
      ]
    }
  );
};
const heroImageEs = "/assets/hero-es-kbcuNBxT.png";
const heroImageEn = "/assets/hero-en-81kcQctz.jpg";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const Form = FormProvider;
const FormFieldContext = React.createContext(
  {}
);
const FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx(Controller, { ...props }) });
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
const FormItemContext = React.createContext(
  {}
);
const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId();
  return /* @__PURE__ */ jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx("div", { ref, className: cn("space-y-2", className), ...props }) });
});
FormItem.displayName = "FormItem";
const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx(
    Label,
    {
      ref,
      className: cn(error && "text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
});
FormLabel.displayName = "FormLabel";
const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx(
    Slot,
    {
      ref,
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
});
FormControl.displayName = "FormControl";
const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formDescriptionId,
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
});
FormDescription.displayName = "FormDescription";
const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error == null ? void 0 : error.message) : children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formMessageId,
      className: cn("text-sm font-medium text-destructive", className),
      ...props,
      children: body
    }
  );
});
FormMessage.displayName = "FormMessage";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
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
function AuditModal({ children, source = "unknown" }) {
  const { t } = useLanguage();
  const { toast: toast2 } = useToast();
  const [open, setOpen] = useState(false);
  const formSchema2 = z.object({
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
    resolver: zodResolver(formSchema2),
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
      toast2({
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
      toast2({
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
const Hero = () => {
  const { language, t } = useLanguage();
  const { isMobile, isTablet } = useDeviceDetect();
  const heroImage = language === "es" ? heroImageEs : heroImageEn;
  return /* @__PURE__ */ jsxs("div", { className: `relative overflow-hidden ${isMobile ? "h-[100dvh] pt-0 pb-0" : isTablet ? "pt-44 pb-24" : "pt-56 pb-32"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0", children: [
      /* @__PURE__ */ jsx("div", { className: `absolute inset-0 z-10 ${isMobile ? "bg-gradient-to-b from-transparent via-black/10 to-black/90" : "bg-gradient-to-r from-turquoise/60 to-sage/40 mix-blend-multiply"}` }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 overflow-hidden",
          style: {
            minHeight: isMobile ? "100%" : isTablet ? "620px" : "650px",
            height: "100%"
          },
          children: /* @__PURE__ */ jsx(
            "img",
            {
              src: heroImage,
              alt: language === "es" ? "Eva Pérez - Experta en Estrategia de Hospitalidad y Bienestar de Lujo" : "Eva Pérez - Expert in Luxury Hospitality & Wellness Strategy",
              className: `w-full h-full object-cover ${isMobile ? "object-[50%_15%]" : isTablet ? "object-[55%_-10%]" : "object-[50%_-10%]"}`
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: `container mx-auto relative z-20 h-full ${isMobile ? "px-6 flex flex-col justify-end pb-12" : isTablet ? "pl-6 pr-6" : "pl-8 pr-8"}`, children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: isMobile ? "w-full" : isTablet ? "max-w-md" : "max-w-xl",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h1", { className: `font-playfair font-bold text-white leading-tight text-shadow ${isMobile ? "text-2xl mb-2" : isTablet ? "text-2xl md:text-3xl mb-3" : "text-3xl lg:text-4xl mb-4"}`, children: language === "es" ? "Eva Pérez: Consultora de Wellness & Spa Manager para Hoteles de Lujo" : "Eva Pérez: Wellness Consultant & Spa Manager for Luxury Hotels" }),
          /* @__PURE__ */ jsx("p", { className: `text-white opacity-90 border-l-4 border-white/70 ${isMobile ? "text-sm mb-4 pl-3" : isTablet ? "text-base mb-3 pl-4 max-w-md" : "text-lg mb-4 pl-5 max-w-lg"}`, children: language === "es" ? "En un motor de crecimiento estratégico, rentable y alineado con la experiencia de lujo." : "Into a strategic growth engine, profitable and aligned with the luxury experience." }),
          /* @__PURE__ */ jsxs("div", { className: isMobile ? "mb-4" : isTablet ? "mb-3" : "mb-4", children: [
            /* @__PURE__ */ jsx("p", { className: `text-white uppercase tracking-wider font-semibold ${isMobile ? "text-xs" : "text-sm"}`, children: language === "es" ? "Experta en Estrategia de Hospitalidad y Bienestar de Lujo" : "Expert in Luxury Hospitality & Wellness Strategy" }),
            /* @__PURE__ */ jsx("p", { className: `text-white/80 ${isMobile ? "text-xs" : "text-sm"}`, children: language === "es" ? "Gerente de Proyectos SPA & Wellness – Especialista en Optimización de Ingresos" : "SPA & Wellness Project Manager – Revenue Optimization Specialist" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: `text-white opacity-80 ${isMobile ? "text-xs mb-6" : isTablet ? "text-sm mb-5 max-w-sm" : "text-sm mb-6 max-w-md"}`, children: language === "es" ? "Más de 20 años de experiencia optimizando operaciones, formando equipos excepcionales y elevando la satisfacción del cliente." : "Over 20 years of experience optimizing operations, training exceptional teams, and elevating customer satisfaction." }),
          /* @__PURE__ */ jsxs("div", { className: `gap-3 ${isMobile ? "flex flex-col w-full" : "flex flex-row"}`, children: [
            /* @__PURE__ */ jsx(AuditModal, { source: "hero_primary", children: /* @__PURE__ */ jsx(
              "button",
              {
                className: `bg-turquoise hover:bg-turquoise-dark text-white font-medium rounded transition-colors inline-block text-center cursor-pointer ${isMobile ? "px-6 py-3 text-sm w-full" : isTablet ? "px-7 py-2.5 text-sm" : "px-8 py-3 text-base"}`,
                children: t("hero.ctaPrimary")
              }
            ) }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "#portfolio",
                "data-analytics-cta": "view_success_stories",
                "data-analytics-location": "hero_secondary",
                className: `bg-white hover:bg-gray-100 text-turquoise-dark font-medium rounded transition-colors inline-block text-center ${isMobile ? "px-6 py-3 text-sm w-full" : isTablet ? "px-7 py-2.5 text-sm" : "px-8 py-3 text-base"}`,
                children: t("hero.ctaSecondary")
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const evaSpeakingImage = "/assets/hero-en-81kcQctz.jpg";
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
const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  objectFit = "cover",
  priority = false
}) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [imageSrc, setImageSrc] = useState(src);
  const [error, setError] = useState(false);
  useEffect(() => {
    setIsLoading(!priority);
    setImageSrc(src);
    setError(false);
  }, [src, priority]);
  const handleLoad = () => {
    setIsLoading(false);
  };
  const handleError = () => {
    setIsLoading(false);
    setError(true);
    setImageSrc("https://placehold.co/600x400/e2e8f0/94a3b8?text=Image+not+available");
  };
  useEffect(() => {
    if (priority && src) {
      const img = new Image();
      img.src = src;
      img.onload = handleLoad;
      img.onerror = handleError;
    }
  }, [priority, src]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `relative overflow-hidden ${className}`,
      style: { width, height },
      children: [
        isLoading && /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: "absolute inset-0 z-10",
            style: { width: "100%", height: "100%" }
          }
        ),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: imageSrc,
            alt,
            className: `w-full h-full transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`,
            style: { objectFit },
            onLoad: handleLoad,
            onError: handleError,
            loading: priority ? "eager" : "lazy"
          }
        )
      ]
    }
  );
};
const AnimatedCounter = ({
  end,
  duration = 2,
  label,
  prefix = "",
  suffix = ""
}) => {
  const [count2, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [hasAnimated, setHasAnimated] = useState(false);
  useEffect(() => {
    if (isInView && !hasAnimated) {
      let startTimestamp;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1e3), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setHasAnimated(true);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration, hasAnimated]);
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      ref,
      className: "text-center",
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.5 },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-turquoise mb-2", children: [
          prefix,
          count2,
          suffix
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-charcoal-light text-sm md:text-base", children: label })
      ]
    }
  );
};
const About = () => {
  const { t, language } = useLanguage();
  return /* @__PURE__ */ jsx("section", { id: "about", className: "py-16 md:py-24 bg-white", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-12 items-center", children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "md:w-1/2",
        initial: { opacity: 0, x: -30 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "rounded-lg shadow-xl overflow-hidden",
              whileHover: { scale: 1.03 },
              transition: { duration: 0.3 },
              children: /* @__PURE__ */ jsx(
                OptimizedImage,
                {
                  src: evaProfileImage,
                  alt: "Eva Pérez, Expert in Luxury Hospitality & Wellness Strategy",
                  className: "w-full h-auto rounded-lg",
                  objectFit: "cover",
                  priority: true
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 mt-4", children: [
            /* @__PURE__ */ jsx(
              motion.div,
              {
                className: "rounded-lg shadow-xl overflow-hidden",
                whileHover: { scale: 1.03 },
                transition: { duration: 0.3 },
                children: /* @__PURE__ */ jsx(
                  OptimizedImage,
                  {
                    src: evaSpeakingImage,
                    alt: "Eva Pérez dando una conferencia",
                    className: "w-full h-auto rounded-lg",
                    objectFit: "cover"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-center mt-2 text-charcoal-light italic", children: t("about.speakingCaption") })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "md:w-1/2",
        initial: { opacity: 0, x: 30 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-wider text-turquoise font-medium mb-3", children: t("about.title") }),
          /* @__PURE__ */ jsx("h3", { className: "font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6", children: t("about.subtitle") }),
          /* @__PURE__ */ jsx("p", { className: "text-charcoal-light mb-6", children: t("about.experience") }),
          /* @__PURE__ */ jsx("p", { className: "text-charcoal-light mb-6", children: t("about.approach") }),
          /* @__PURE__ */ jsx("p", { className: "text-charcoal-light mb-6", children: t("about.speaker") }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-8 mb-10", children: [
            /* @__PURE__ */ jsx(AnimatedCounter, { end: 20, suffix: "+", label: t("about.stats.years") }),
            /* @__PURE__ */ jsx(AnimatedCounter, { end: 50, suffix: "+", label: t("about.stats.projects") }),
            /* @__PURE__ */ jsx(AnimatedCounter, { end: 30, suffix: "+", label: t("about.stats.conferences") }),
            /* @__PURE__ */ jsx(AnimatedCounter, { end: 200, suffix: "+", label: t("about.stats.trained") }),
            /* @__PURE__ */ jsx(AnimatedCounter, { end: 5e3, label: t("about.stats.attendees"), prefix: "", suffix: "+" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
            /* @__PURE__ */ jsxs(
              motion.a,
              {
                href: "#contact",
                className: "bg-turquoise text-white px-6 py-3 rounded-lg inline-flex items-center justify-center hover:bg-turquoise-dark transition-colors",
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                children: [
                  /* @__PURE__ */ jsx("span", { children: t("about.contact") }),
                  /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.a,
              {
                href: "#portfolio",
                className: "border border-turquoise text-turquoise px-6 py-3 rounded-lg inline-flex items-center justify-center hover:bg-turquoise hover:text-white transition-colors",
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                children: [
                  /* @__PURE__ */ jsx("span", { children: t("about.portfolio") }),
                  /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
                ]
              }
            )
          ] })
        ]
      }
    )
  ] }) }) });
};
const ServiceModal = ({ isOpen, onClose, service }) => {
  const { language } = useLanguage();
  if (!service) return null;
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[600px] max-h-[90vh] flex flex-col font-poppins p-0 gap-0 bg-white border-none shadow-2xl z-[60] overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-turquoise/10 to-transparent p-6 md:p-8 flex items-center gap-6 border-b border-gray-100", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-turquoise", children: /* @__PURE__ */ jsx("i", { className: `fas ${service.icon} text-2xl` }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(DialogTitle, { className: "font-playfair text-2xl md:text-3xl font-bold text-charcoal", children: service.title[language] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-grow overflow-y-auto bg-white", children: /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 space-y-6", children: [
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-base text-charcoal-light leading-relaxed", children: service.longDescription ? service.longDescription[language] : service.description[language] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-50/80 p-6 rounded-xl border border-gray-100", children: [
        /* @__PURE__ */ jsxs("h4", { className: "font-bold text-charcoal mb-4 flex items-center gap-2 font-playfair text-lg", children: [
          /* @__PURE__ */ jsx("i", { className: "fas fa-star text-turquoise" }),
          language === "es" ? "Características Clave" : "Key Features"
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: service.features[language].map((feature, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "mt-1.5 w-1.5 h-1.5 rounded-full bg-turquoise shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "text-charcoal-light", children: feature })
        ] }, index)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "p-6 border-t border-gray-100 bg-gray-50/50", children: /* @__PURE__ */ jsx(
      Button,
      {
        onClick: () => {
          onClose();
          const contactSection = document.getElementById("contact");
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
          }
        },
        className: "w-full bg-turquoise hover:bg-turquoise-dark text-white font-medium py-6 text-lg shadow-lg hover:shadow-xl transition-all",
        children: language === "es" ? "Solicitar Consultoría" : "Request Consultation"
      }
    ) })
  ] }) });
};
const Services = () => {
  const { t, language } = useLanguage();
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  return /* @__PURE__ */ jsxs("section", { id: "services", className: "py-16 md:py-24 bg-gray-50", children: [
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "text-center max-w-3xl mx-auto mb-16",
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6 },
          children: [
            /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-wider text-turquoise font-medium mb-3", children: t("services.title") }),
            /* @__PURE__ */ jsx("h3", { className: "font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6", children: t("services.subtitle") }),
            /* @__PURE__ */ jsx("p", { className: "text-charcoal-light", children: t("services.subtitle") })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
          variants: containerVariants,
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          children: services.map((service, index) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              className: "bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
              variants: itemVariants,
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-turquoise/10 rounded-full flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx("i", { className: `fas ${service.icon} text-turquoise text-2xl` }) }),
                /* @__PURE__ */ jsx("h4", { className: "font-playfair text-xl font-bold text-charcoal mb-4", children: service.title[language] }),
                /* @__PURE__ */ jsx("p", { className: "text-charcoal-light mb-4 line-clamp-3", children: service.description[language] }),
                /* @__PURE__ */ jsx("ul", { className: "space-y-2 mb-6", children: service.features[language].map((feature, featureIndex) => /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                  /* @__PURE__ */ jsx("i", { className: "fas fa-check text-turquoise mt-1 mr-2" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-charcoal-light", children: feature })
                ] }, featureIndex)) }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => handleOpenModal(service),
                    className: "text-turquoise hover:text-turquoise-dark font-medium text-sm flex items-center",
                    children: [
                      t("services.moreInfo"),
                      " ",
                      /* @__PURE__ */ jsx("i", { className: "fas fa-arrow-right ml-1" })
                    ]
                  }
                )
              ]
            },
            index
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      ServiceModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        service: selectedService
      }
    )
  ] });
};
const CallToAction = () => {
  const { language } = useLanguage();
  const content = {
    es: {
      title: "¿Listo para transformar tu negocio wellness?",
      description: "Agenda una consulta gratuita para descubrir cómo podemos optimizar tu spa y elevar la experiencia de tus clientes.",
      button: "Agendar consulta"
    },
    en: {
      title: "Ready to transform your wellness business?",
      description: "Schedule a free consultation to discover how we can optimize your spa and elevate your customers' experience.",
      button: "Book consultation"
    }
  };
  return /* @__PURE__ */ jsx("section", { className: "py-16 md:py-20 bg-turquoise text-white", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "flex flex-col md:flex-row items-center justify-between gap-8",
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6 },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "md:w-2/3", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-playfair text-2xl md:text-3xl font-bold mb-4", children: content[language].title }),
          /* @__PURE__ */ jsx("p", { className: "text-white/90 text-lg", children: content[language].description })
        ] }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(AuditModal, { source: "mid_page_consultation", children: /* @__PURE__ */ jsx("button", { className: "inline-block bg-white text-turquoise-dark hover:bg-gray-100 transition-colors font-medium px-8 py-3 rounded cursor-pointer", children: content[language].button }) }) })
      ]
    }
  ) }) });
};
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const ProjectModal = ({ isOpen, onClose, project }) => {
  const { language } = useLanguage();
  if (!project) return null;
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[900px] w-[95vw] h-[90vh] max-h-[90vh] flex flex-col font-poppins p-0 border-none shadow-2xl bg-white z-[60] overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative h-64 md:h-80 w-full shrink-0 bg-gray-900", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: project.image,
          alt: project.title[language],
          className: "w-full h-full object-cover opacity-90"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-6 md:p-8", children: /* @__PURE__ */ jsxs("div", { className: "w-full relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-between items-end mb-3", children: /* @__PURE__ */ jsx(Badge, { className: "bg-turquoise text-white border-none text-xs md:text-sm px-3 py-1 shadow-sm", children: project.categoryName[language] }) }),
        /* @__PURE__ */ jsx(DialogTitle, { className: "font-playfair text-2xl md:text-4xl text-white font-bold drop-shadow-md leading-tight", children: project.title[language] })
      ] }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2.5 rounded-full backdrop-blur-md transition-all border border-white/20 z-20 shadow-lg",
          "aria-label": "Close modal",
          children: /* @__PURE__ */ jsx("i", { className: "fas fa-times text-lg w-5 h-5 flex items-center justify-center" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto bg-white relative z-50", children: /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 space-y-8 pb-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("h4", { className: "font-playfair text-xl md:text-2xl font-bold text-charcoal flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "w-8 h-1 bg-turquoise rounded-full block" }),
          language === "es" ? "Sobre el Proyecto" : "About the Project"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { className: "text-lg md:text-xl text-charcoal-light leading-relaxed font-light", children: project.description[language] }),
        /* @__PURE__ */ jsx("div", { className: "prose prose-lg text-charcoal-light max-w-none", children: /* @__PURE__ */ jsx("p", { className: "whitespace-pre-line leading-relaxed", children: project.longDescription[language] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-6 rounded-xl border border-gray-100", children: [
          /* @__PURE__ */ jsxs("h4", { className: "font-bold text-charcoal mb-4 flex items-center gap-2 text-lg", children: [
            /* @__PURE__ */ jsx("i", { className: "fas fa-clipboard-check text-turquoise" }),
            language === "es" ? "Desafíos & Soluciones" : "Challenges & Solutions"
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: project.highlights[language].map((highlight, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "mt-1.5 w-1.5 h-1.5 rounded-full bg-turquoise shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-charcoal-light leading-relaxed", children: highlight })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-xl shadow-lg border border-gray-100", children: [
          /* @__PURE__ */ jsxs("h4", { className: "font-bold text-charcoal mb-4 flex items-center gap-2 text-lg", children: [
            /* @__PURE__ */ jsx("i", { className: "fas fa-trophy text-gold" }),
            language === "es" ? "Logros Destacados" : "Key Achievements"
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: project.results[language].map((result, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("i", { className: "fas fa-star text-gold mt-1 shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-charcoal-light leading-relaxed", children: result })
          ] }, index)) })
        ] })
      ] })
    ] }) })
  ] }) });
};
const Portfolio = () => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };
  const filteredItems = portfolioItems.filter(
    (item) => activeFilter === "all" || item.chain === activeFilter
  );
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  return /* @__PURE__ */ jsxs("section", { id: "portfolio", className: "py-16 md:py-24 bg-white", children: [
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "text-center max-w-3xl mx-auto mb-16",
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6 },
          children: [
            /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-wider text-turquoise font-medium mb-3", children: t("portfolio.title") }),
            /* @__PURE__ */ jsx("h3", { className: "font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6", children: t("portfolio.subtitle") }),
            /* @__PURE__ */ jsx("p", { className: "text-charcoal-light", children: t("portfolio.description") })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "bg-gradient-to-r from-turquoise/10 to-turquoise/5 rounded-lg p-6 mb-10 text-center",
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6 },
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-8", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold text-turquoise mb-1", children: "40+" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-charcoal-light", children: language === "es" ? "Proyectos Completados" : "Completed Projects" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold text-turquoise mb-1", children: "6" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-charcoal-light", children: language === "es" ? "Cadenas Hoteleras" : "Hotel Chains" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold text-turquoise mb-1", children: "20+" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-charcoal-light", children: language === "es" ? "Años de Experiencia" : "Years of Experience" })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex mb-10 justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-2 overflow-x-auto pb-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeFilter === "all" ? "bg-turquoise text-white" : "bg-gray-100 text-charcoal hover:bg-turquoise/10"} rounded-full text-sm font-medium transition-colors whitespace-nowrap`,
            onClick: () => setActiveFilter("all"),
            children: t("portfolio.all")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeFilter === "paradores" ? "bg-turquoise text-white" : "bg-gray-100 text-charcoal hover:bg-turquoise/10"} rounded-full text-sm font-medium transition-colors whitespace-nowrap`,
            onClick: () => setActiveFilter("paradores"),
            children: "Paradores"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeFilter === "eurostars" ? "bg-turquoise text-white" : "bg-gray-100 text-charcoal hover:bg-turquoise/10"} rounded-full text-sm font-medium transition-colors whitespace-nowrap`,
            onClick: () => setActiveFilter("eurostars"),
            children: "Eurostars"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeFilter === "hg" ? "bg-turquoise text-white" : "bg-gray-100 text-charcoal hover:bg-turquoise/10"} rounded-full text-sm font-medium transition-colors whitespace-nowrap`,
            onClick: () => setActiveFilter("hg"),
            children: "HG Hotels"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeFilter === "melia" ? "bg-turquoise text-white" : "bg-gray-100 text-charcoal hover:bg-turquoise/10"} rounded-full text-sm font-medium transition-colors whitespace-nowrap`,
            onClick: () => setActiveFilter("melia"),
            children: "Meliá"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeFilter === "axel" ? "bg-turquoise text-white" : "bg-gray-100 text-charcoal hover:bg-turquoise/10"} rounded-full text-sm font-medium transition-colors whitespace-nowrap`,
            onClick: () => setActiveFilter("axel"),
            children: "AXEL"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `px-4 py-2 ${activeFilter === "independientes" ? "bg-turquoise text-white" : "bg-gray-100 text-charcoal hover:bg-turquoise/10"} rounded-full text-sm font-medium transition-colors whitespace-nowrap`,
            onClick: () => setActiveFilter("independientes"),
            children: language === "es" ? "Independientes" : "Independent"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
          variants: containerVariants,
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          children: filteredItems.map((item, index) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              className: "group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
              variants: itemVariants,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "relative h-64", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: item.image,
                      alt: item.title[language],
                      className: "w-full h-full object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end", children: /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-medium bg-turquoise text-white px-2 py-1 rounded", children: item.categoryName[language] }) }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-playfair text-xl font-bold text-charcoal mb-2", children: item.title[language] }),
                  /* @__PURE__ */ jsx("p", { className: "text-charcoal-light text-sm mb-4 line-clamp-3", children: item.description[language] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => handleOpenModal(item),
                      className: "text-turquoise hover:text-turquoise-dark font-medium text-sm flex items-center",
                      children: [
                        t("portfolio.viewCase"),
                        " ",
                        /* @__PURE__ */ jsx("i", { className: "fas fa-arrow-right ml-1" })
                      ]
                    }
                  )
                ] })
              ]
            },
            index
          ))
        },
        activeFilter
      ),
      /* @__PURE__ */ jsx("div", { className: "text-center mt-12", children: /* @__PURE__ */ jsx("a", { href: "#", className: "inline-block px-8 py-3 border border-turquoise text-turquoise hover:bg-turquoise hover:text-white transition-colors rounded font-medium", children: t("portfolio.viewMore") }) })
    ] }),
    /* @__PURE__ */ jsx(
      ProjectModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        project: selectedProject
      }
    )
  ] });
};
const Testimonials = () => {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const sliderRef = useRef(null);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const maxSlide = testimonials.length - slidesPerView;
  const goToSlide = (slide) => {
    const newSlide = Math.max(0, Math.min(slide, maxSlide));
    setCurrentSlide(newSlide);
    if (sliderRef.current) {
      const translateX = newSlide * -100 / slidesPerView;
      sliderRef.current.style.transform = `translateX(${translateX}%)`;
    }
  };
  const goToPrev = () => goToSlide(currentSlide - 1);
  const goToNext = () => goToSlide(currentSlide + 1);
  return /* @__PURE__ */ jsx("section", { id: "testimonials", className: "py-16 md:py-24 bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "text-center max-w-3xl mx-auto mb-16",
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-wider text-turquoise font-medium mb-3", children: t("testimonials.title") }),
          /* @__PURE__ */ jsx("h3", { className: "font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6", children: t("testimonials.subtitle") }),
          /* @__PURE__ */ jsx("p", { className: "text-charcoal-light", children: t("testimonials.description") })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative testimonial-slider overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: sliderRef,
          className: "flex transition-transform duration-500",
          style: { transform: `translateX(${-currentSlide * 100 / slidesPerView}%)` },
          children: testimonials.map((testimonial, index) => /* @__PURE__ */ jsx("div", { className: `w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4`, children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-8 rounded-lg shadow-md", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center mb-4", children: /* @__PURE__ */ jsxs("div", { className: "text-yellow-400 flex", children: [
              /* @__PURE__ */ jsx("i", { className: "fas fa-star" }),
              /* @__PURE__ */ jsx("i", { className: "fas fa-star" }),
              /* @__PURE__ */ jsx("i", { className: "fas fa-star" }),
              /* @__PURE__ */ jsx("i", { className: "fas fa-star" }),
              /* @__PURE__ */ jsx("i", { className: "fas fa-star" })
            ] }) }),
            /* @__PURE__ */ jsx("blockquote", { className: "mb-6", children: /* @__PURE__ */ jsxs("p", { className: "font-cormorant text-lg italic text-charcoal", children: [
              '"',
              typeof testimonial.quote === "object" ? testimonial.quote[language] : testimonial.quote,
              '"'
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: testimonial.avatar,
                  alt: testimonial.name,
                  className: "w-12 h-12 rounded-full object-cover mr-4"
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-charcoal", children: testimonial.name }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-charcoal-light", children: typeof testimonial.position === "object" ? testimonial.position[language] : testimonial.position })
              ] })
            ] })
          ] }) }, index))
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center focus:outline-none z-10 ml-2 lg:ml-6 hover:bg-gray-50",
          onClick: goToPrev,
          disabled: currentSlide === 0,
          children: /* @__PURE__ */ jsx("i", { className: "fas fa-chevron-left text-turquoise" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center focus:outline-none z-10 mr-2 lg:mr-6 hover:bg-gray-50",
          onClick: goToNext,
          disabled: currentSlide === maxSlide,
          children: /* @__PURE__ */ jsx("i", { className: "fas fa-chevron-right text-turquoise" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-6 space-x-2", children: Array.from({ length: maxSlide + 1 }).map((_, index) => /* @__PURE__ */ jsx(
      "button",
      {
        className: `w-3 h-3 rounded-full ${currentSlide === index ? "bg-turquoise" : "bg-gray-300"}`,
        onClick: () => goToSlide(index)
      },
      index
    )) })
  ] }) });
};
const Blog = () => {
  const { t, language } = useLanguage();
  const { data: apiArticles, isLoading } = useQuery({
    queryKey: ["/api/articles"]
  });
  const { latestArticles, archiveArticles } = useMemo(() => {
    const filtered = apiArticles ? apiArticles.filter((article) => article.language === (language === "es" ? "es" : "en")) : blogPosts.map((post, index) => ({
      id: index + 1e3,
      slug: `post-${index}`,
      title: post.title[language],
      content: post.content[language].join("\n\n"),
      excerpt: post.excerpt[language],
      image: post.image,
      category: post.category[language],
      readTime: post.readTime[language],
      date: (/* @__PURE__ */ new Date()).toISOString()
    }));
    const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = sorted.filter((a) => new Date(a.date).getFullYear() >= 2026);
    const archive = sorted.filter((a) => new Date(a.date).getFullYear() < 2026);
    return { latestArticles: latest, archiveArticles: archive };
  }, [apiArticles, language]);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("section", { id: "blog", className: "py-20 md:py-32 bg-gray-50 relative", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center max-w-3xl mx-auto mb-20", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24 mx-auto mb-3" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-3/4 mx-auto mb-6" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-1/2 mx-auto" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsx("div", { className: `h-full rounded-2xl overflow-hidden shadow-lg ${i === 1 ? "md:col-span-2 lg:col-span-2" : ""} ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`, children: /* @__PURE__ */ jsx(Skeleton, { className: "h-full w-full" }) }, i)) })
    ] }) });
  }
  const BlogGrid = ({ articles, delay = 0 }) => /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]",
      variants: containerVariants,
      initial: "hidden",
      whileInView: "visible",
      viewport: { once: true },
      children: articles.map((post, index) => /* @__PURE__ */ jsx(Link, { href: `/blog/${post.slug}`, children: /* @__PURE__ */ jsx("a", { className: `block h-full group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${index === 0 && articles.length > 1 ? "md:col-span-2 lg:col-span-2" : ""} ${index === 3 && articles.length > 4 ? "md:col-span-2 lg:col-span-1" : ""}`, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "h-full w-full",
          variants: itemVariants,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "absolute inset-0", children: [
              /* @__PURE__ */ jsx(
                OptimizedImage,
                {
                  src: post.image,
                  alt: post.title,
                  className: "w-full h-full transition-transform duration-700 group-hover:scale-110",
                  objectFit: "cover",
                  priority: index < 2
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 p-8 flex flex-col justify-end", children: /* @__PURE__ */ jsxs("div", { className: "transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-4 text-white/80 text-xs font-medium uppercase tracking-wider", children: [
                /* @__PURE__ */ jsxs("span", { className: "bg-turquoise/90 text-white px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Tag, { className: "w-3 h-3" }),
                  post.category
                ] }),
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: new Date(post.date).toLocaleDateString(language === "es" ? "es-ES" : "en-US") })
              ] }),
              /* @__PURE__ */ jsx("h4", { className: `font-playfair font-bold text-white mb-3 leading-tight group-hover:text-turquoise-light transition-colors ${index === 0 ? "text-3xl md:text-4xl" : "text-2xl"}`, children: post.title }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-200 mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100", children: post.excerpt }),
              /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center text-white font-medium group/link", children: [
                /* @__PURE__ */ jsx("span", { className: "border-b border-turquoise pb-1 group-hover/link:border-white transition-colors", children: t("blog.readArticle") }),
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" })
              ] })
            ] }) })
          ]
        }
      ) }) }, post.id))
    }
  );
  return /* @__PURE__ */ jsx("section", { id: "blog", className: "py-20 md:py-32 bg-gray-50 relative", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "text-center max-w-3xl mx-auto mb-20",
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-wider text-turquoise font-medium mb-3", children: t("blog.title") }),
          /* @__PURE__ */ jsx("h3", { className: "font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6 leading-tight", children: t("blog.subtitle") }),
          /* @__PURE__ */ jsx("p", { className: "text-charcoal-light text-lg", children: t("blog.description") })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mb-20", children: /* @__PURE__ */ jsx(BlogGrid, { articles: latestArticles }) }),
    archiveArticles.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-20", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "flex items-center gap-4 mb-10",
          initial: { opacity: 0, x: -20 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true },
          children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-playfair text-3xl md:text-4xl font-bold text-charcoal", children: [
              "2025 ",
              language === "es" ? "Archivo" : "Archive"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-px bg-gray-200 flex-grow" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(BlogGrid, { articles: archiveArticles })
    ] })
  ] }) });
};
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
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
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
  const formSchema2 = z.object({
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
    resolver: zodResolver(formSchema2),
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
        trackEvent("generate_lead", {
          lead_type: "appointment",
          service: values.service,
          language
        });
        trackEvent("book_appointment", {
          service: values.service,
          language
        });
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
                language === "es" ? "a las" : "at",
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
const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast: toast2 } = useToast();
  const { language, t } = useLanguage();
  const formSchema2 = z.object({
    name: z.string().min(2, {
      message: language === "es" ? "El nombre debe tener al menos 2 caracteres" : "Name must have at least 2 characters"
    }),
    email: z.string().email({
      message: language === "es" ? "Por favor introduce un email válido" : "Please enter a valid email address"
    }),
    company: z.string().optional(),
    service: z.string({
      required_error: language === "es" ? "Por favor selecciona un servicio" : "Please select a service"
    }),
    message: z.string().min(10, {
      message: language === "es" ? "Tu mensaje debe tener al menos 10 caracteres" : "Your message must have at least 10 characters"
    }),
    privacy: z.boolean().refine((val) => val === true, {
      message: language === "es" ? "Debes aceptar la política de privacidad" : "You must accept the privacy policy"
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      service: "",
      message: "",
      privacy: false
    }
  });
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiRequest({
        path: "/api/contact",
        method: "POST",
        body: data
      });
      trackEvent("generate_lead", { lead_type: "contact", service: data.service });
      toast2({
        title: language === "es" ? "Mensaje enviado" : "Message sent",
        description: language === "es" ? "Gracias por contactar. Te responderé a la brevedad." : "Thank you for contacting me. I will respond shortly."
      });
      form.reset();
    } catch (error) {
      toast2({
        title: "Error",
        description: language === "es" ? "Hubo un problema al enviar el mensaje. Inténtalo nuevamente." : "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { id: "contact", className: "py-16 md:py-24 bg-white", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-12", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "lg:w-1/2",
        initial: { opacity: 0, x: -30 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-wider text-turquoise font-medium mb-3", children: language === "es" ? "Contacto" : "Contact" }),
          /* @__PURE__ */ jsx("h3", { className: "font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6", children: language === "es" ? "¿Hablamos sobre tu proyecto?" : "Let's talk about your project" }),
          /* @__PURE__ */ jsx("p", { className: "text-charcoal-light mb-8", children: language === "es" ? "Completa el formulario y me pondré en contacto contigo para programar una consulta inicial gratuita donde podremos hablar sobre tus necesidades específicas." : "Fill out the form and I will contact you to schedule a free initial consultation where we can discuss your specific needs." }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 mb-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-turquoise/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0", children: /* @__PURE__ */ jsx("i", { className: "fas fa-envelope text-turquoise" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-medium text-charcoal mb-1", children: "Email" }),
                /* @__PURE__ */ jsx("a", { href: "mailto:epm@epmwellness.com", className: "text-turquoise hover:text-turquoise-dark", children: "epm@epmwellness.com" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-turquoise/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0", children: /* @__PURE__ */ jsx("i", { className: "fas fa-phone text-turquoise" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-medium text-charcoal mb-1", children: language === "es" ? "Teléfono" : "Phone" }),
                /* @__PURE__ */ jsx("a", { href: "tel:+34676462991", className: "text-turquoise hover:text-turquoise-dark", children: "+34 676 462 991" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-turquoise/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0", children: /* @__PURE__ */ jsx("i", { className: "fas fa-map-marker-alt text-turquoise" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-medium text-charcoal mb-1", children: language === "es" ? "Ubicación" : "Location" }),
                /* @__PURE__ */ jsx("p", { className: "text-charcoal-light", children: language === "es" ? "Madrid, España (Disponible para proyectos internacionales)" : "Madrid, Spain (Available for international projects)" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex space-x-4", children: /* @__PURE__ */ jsx("a", { href: "https://www.linkedin.com/in/evaperez-spa-consultant/", target: "_blank", rel: "noopener noreferrer", className: "w-10 h-10 bg-turquoise/10 rounded-full flex items-center justify-center text-turquoise hover:bg-turquoise hover:text-white transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fab fa-linkedin-in" }) }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "lg:w-1/2",
        initial: { opacity: 0, x: 30 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, delay: 0.2 },
        children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "message", className: "bg-white rounded-lg shadow-md", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
            /* @__PURE__ */ jsx(TabsTrigger, { value: "message", className: "text-base", children: language === "es" ? "Enviar mensaje" : "Send message" }),
            /* @__PURE__ */ jsx(
              TabsTrigger,
              {
                value: "booking",
                className: "text-base",
                "data-analytics-cta": "open_booking",
                "data-analytics-location": "contact_tabs",
                children: language === "es" ? "Reservar consulta" : "Book consultation"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "message", className: "p-6", children: /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "bg-white", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [
              /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "name",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                    /* @__PURE__ */ jsx(FormLabel, { className: "block text-charcoal font-medium mb-2", children: language === "es" ? "Nombre" : "Name" }),
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        placeholder: language === "es" ? "Tu nombre" : "Your name",
                        className: "w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none transition-colors",
                        ...field
                      }
                    ) }),
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
                    /* @__PURE__ */ jsx(FormLabel, { className: "block text-charcoal font-medium mb-2", children: "Email" }),
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "email",
                        placeholder: language === "es" ? "tu@email.com" : "your@email.com",
                        className: "w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none transition-colors",
                        ...field
                      }
                    ) }),
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
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "mb-6", children: [
                  /* @__PURE__ */ jsx(FormLabel, { className: "block text-charcoal font-medium mb-2", children: language === "es" ? "Empresa/Organización" : "Company/Organization" }),
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                    Input,
                    {
                      placeholder: language === "es" ? "Nombre de tu empresa" : "Your company name",
                      className: "w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none transition-colors",
                      ...field
                    }
                  ) }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "service",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "mb-6", children: [
                  /* @__PURE__ */ jsx(FormLabel, { className: "block text-charcoal font-medium mb-2", children: language === "es" ? "Servicio de interés" : "Service of interest" }),
                  /* @__PURE__ */ jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none transition-colors", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: language === "es" ? "Selecciona un servicio" : "Select a service" }) }) }),
                    /* @__PURE__ */ jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsx(SelectItem, { value: "consultoria", children: language === "es" ? "Consultoría Estratégica" : "Strategic Consulting" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "proyectos", children: language === "es" ? "Gestión de Proyectos" : "Project Management" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "formacion", children: language === "es" ? "Formación y Desarrollo" : "Training and Development" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "interim", children: language === "es" ? "Interim Management" : "Interim Management" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "otro", children: language === "es" ? "Otro" : "Other" })
                    ] })
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
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "mb-6", children: [
                  /* @__PURE__ */ jsx(FormLabel, { className: "block text-charcoal font-medium mb-2", children: language === "es" ? "Mensaje" : "Message" }),
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                    Textarea,
                    {
                      placeholder: language === "es" ? "Cuéntame sobre tu proyecto o necesidad" : "Tell me about your project or need",
                      className: "w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none transition-colors",
                      rows: 4,
                      ...field
                    }
                  ) }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "privacy",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex items-start mb-6", children: [
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                    Checkbox,
                    {
                      checked: field.value,
                      onCheckedChange: field.onChange,
                      className: "mt-1 mr-2"
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1 leading-none", children: [
                    /* @__PURE__ */ jsx(FormLabel, { className: "text-sm text-charcoal-light", children: language === "es" ? "Acepto la política de privacidad y el tratamiento de mis datos para recibir comunicaciones." : "I accept the privacy policy and the processing of my data to receive communications." }),
                    /* @__PURE__ */ jsx(FormMessage, {})
                  ] })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "submit",
                className: "w-full bg-turquoise hover:bg-turquoise-dark text-white font-medium py-3 rounded transition-colors",
                disabled: isSubmitting,
                children: isSubmitting ? language === "es" ? "Enviando..." : "Sending..." : language === "es" ? "Enviar mensaje" : "Send message"
              }
            )
          ] }) }) }),
          /* @__PURE__ */ jsxs(TabsContent, { value: "booking", className: "p-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-charcoal mb-2", children: language === "es" ? "Reserva una consulta personalizada" : "Book a personalized consultation" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: language === "es" ? "Selecciona la fecha y hora que mejor te convenga para nuestra reunión." : "Select the date and time that works best for you for our meeting." })
            ] }),
            /* @__PURE__ */ jsx(BookingCalendar, {})
          ] })
        ] })
      }
    )
  ] }) }) });
};
const Newsletter = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast: toast2 } = useToast();
  const { t, language } = useLanguage();
  const formSchema2 = z.object({
    email: z.string().email({
      message: language === "es" ? "Por favor introduce un email válido" : "Please enter a valid email address"
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      email: ""
    }
  });
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiRequest({
        method: "POST",
        path: "/api/newsletter",
        body: data
      });
      trackEvent("sign_up", { method: "newsletter" });
      trackEvent("ebook_download", { resource: "guia-rentabilidad-spa" });
      toast2({
        title: language === "es" ? "¡Guía enviada!" : "Guide sent!",
        description: language === "es" ? "Revisa tu email para descargar la Guía de Rentabilidad." : "Check your email to download the Profitability Guide."
      });
      form.reset();
    } catch (error) {
      toast2({
        title: "Error",
        description: language === "es" ? "Hubo un problema al procesar tu solicitud. Inténtalo de nuevo." : "There was a problem processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("section", { className: "py-12 md:py-16 bg-turquoise text-white", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "flex flex-col md:flex-row items-center justify-between gap-8",
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6 },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "md:w-1/2", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-playfair text-2xl md:text-3xl font-bold mb-4", children: t("newsletter.leadMagnetTitle") }),
          /* @__PURE__ */ jsx("p", { className: "text-white/90", children: t("newsletter.leadMagnetSubtitle") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "md:w-1/2", children: /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "flex flex-col sm:flex-row gap-3", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "email",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex-grow", children: [
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: language === "es" ? "Tu email" : "Your email",
                    className: "flex-grow p-3 rounded border-0 focus:ring-2 focus:ring-white/50 outline-none text-gray-900 bg-white placeholder:text-gray-500",
                    ...field
                  }
                ) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              className: "bg-white text-turquoise-dark hover:bg-gray-100 transition-colors font-medium px-6 py-3 rounded whitespace-nowrap",
              disabled: isSubmitting,
              children: isSubmitting ? t("newsletter.sending") : t("newsletter.downloadButton")
            }
          )
        ] }) }) })
      ]
    }
  ) }) });
};
const Footer = () => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const { t, language } = useLanguage();
  return /* @__PURE__ */ jsx("footer", { className: "bg-charcoal-dark text-white pt-16 pb-24 md:pb-8", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5 },
          children: [
            /* @__PURE__ */ jsx("div", { className: "font-playfair text-2xl font-bold text-white mb-4", children: "Eva Pérez" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-6 text-sm leading-relaxed", children: language === "es" ? "Más de 20 años transformando espacios de bienestar en experiencias memorables y rentables." : "Over 20 years transforming wellness spaces into memorable and profitable experiences." }),
            /* @__PURE__ */ jsx("div", { className: "flex space-x-4", children: /* @__PURE__ */ jsx(
              "a",
              {
                href: "https://www.linkedin.com/in/evaperez-spa-consultant/",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-gray-400 hover:text-turquoise transition-colors w-10 h-10 flex items-center justify-center bg-charcoal rounded-full hover:bg-opacity-80",
                "aria-label": "LinkedIn",
                children: /* @__PURE__ */ jsx(FaLinkedinIn, { size: 18 })
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, delay: 0.1 },
          children: [
            /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium text-white mb-4", children: language === "es" ? "Enlaces rápidos" : "Quick Links" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-sm", children: [
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#about", className: "text-gray-400 hover:text-turquoise transition-colors", children: t("header.about") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#services", className: "text-gray-400 hover:text-turquoise transition-colors", children: t("header.services") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#portfolio", className: "text-gray-400 hover:text-turquoise transition-colors", children: t("header.portfolio") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#testimonials", className: "text-gray-400 hover:text-turquoise transition-colors", children: t("header.testimonials") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#blog", className: "text-gray-400 hover:text-turquoise transition-colors", children: t("header.blog") }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#contact", className: "text-gray-400 hover:text-turquoise transition-colors", children: t("header.contact") }) })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, delay: 0.2 },
          children: [
            /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium text-white mb-4", children: language === "es" ? "Contacto" : "Contact" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-4 text-sm", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx(FaEnvelope, { className: "text-turquoise mt-1 mr-3 flex-shrink-0" }),
                /* @__PURE__ */ jsx("a", { href: "mailto:epm@epmwellness.com", className: "text-gray-400 hover:text-turquoise transition-colors", children: "epm@epmwellness.com" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx(FaPhone, { className: "text-turquoise mt-1 mr-3 flex-shrink-0" }),
                /* @__PURE__ */ jsx("a", { href: "tel:+34676462991", className: "text-gray-400 hover:text-turquoise transition-colors", children: "+34 676 462 991" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "text-turquoise mt-1 mr-3 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: language === "es" ? "Madrid, España" : "Madrid, Spain" })
              ] })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("hr", { className: "border-gray-700 mb-8" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-xs mb-4 md:mb-0", children: [
        "© ",
        currentYear,
        " Eva Pérez. ",
        language === "es" ? "Todos los derechos reservados." : "All rights reserved."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-6", children: [
        /* @__PURE__ */ jsx(Link, { href: "/privacy", className: "text-gray-400 hover:text-turquoise text-xs transition-colors", children: language === "es" ? "Política de Privacidad" : "Privacy Policy" }),
        /* @__PURE__ */ jsx(Link, { href: "/terms", className: "text-gray-400 hover:text-turquoise text-xs transition-colors", children: language === "es" ? "Términos y Condiciones" : "Terms & Conditions" }),
        /* @__PURE__ */ jsx(Link, { href: "/cookies", className: "text-gray-400 hover:text-turquoise text-xs transition-colors", children: language === "es" ? "Cookies" : "Cookies" })
      ] })
    ] })
  ] }) });
};
const formSchema$1 = z.object({
  email: z.string().email({
    message: "Por favor, introduce un email válido"
  })
});
const EbookPopup = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast: toast2 } = useToast();
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasClosedPopup = localStorage.getItem("ebookPopupClosed");
      if (!hasClosedPopup) {
        setIsOpen(true);
      }
    }, 3e3);
    return () => clearTimeout(timer);
  }, []);
  const form = useForm({
    resolver: zodResolver(formSchema$1),
    defaultValues: {
      email: ""
    }
  });
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiRequest({
        path: "/api/newsletter",
        method: "POST",
        body: { email: data.email }
      });
      trackEvent("sign_up", { method: "ebook_popup" });
      trackEvent("ebook_download", { resource: "guia-rentabilidad-spa" });
      setIsSuccess(true);
      toast2({
        title: language === "es" ? "¡Gracias por tu interés!" : "Thank you for your interest!",
        description: language === "es" ? "Hemos enviado el E-Book a tu correo electrónico. Revisa tu bandeja de entrada." : "We have sent the E-Book to your email. Please check your inbox.",
        variant: "default"
      });
      setTimeout(() => {
        setIsOpen(false);
        localStorage.setItem("ebookPopupClosed", "true");
      }, 2e3);
    } catch (error) {
      console.error("Error al enviar el email:", error);
      toast2({
        title: language === "es" ? "Error" : "Error",
        description: language === "es" ? "Ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo." : "An error occurred while processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem("ebookPopupClosed", "true");
  };
  const popupTitle = language === "es" ? "E-Book + plantilla: Cómo implementar IA en tu spa hotelero en 30 días" : "E-Book + template: How to implement AI in your hotel spa in 30 days";
  const popupDescription = language === "es" ? "Descarga esta guía práctica con los pasos concretos para comenzar a aplicar soluciones de IA en tu spa, incluyendo una plantilla de implementación lista para usar." : "Download this practical guide with concrete steps to start applying AI solutions in your spa, including a ready-to-use implementation template.";
  const buttonText = language === "es" ? isSubmitting ? "Enviando..." : "Descargar ahora" : isSubmitting ? "Sending..." : "Download now";
  const emailPlaceholder = language === "es" ? "Tu email" : "Your email";
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "relative bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden font-poppins",
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.9, opacity: 0 },
          transition: { type: "spring", damping: 25, stiffness: 300 },
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: closePopup,
                className: "absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors z-10",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsx(X, { size: 24 })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl md:text-2xl font-playfair font-bold text-charcoal mb-4 leading-tight", children: popupTitle }),
              /* @__PURE__ */ jsx("p", { className: "text-charcoal-light mb-6 text-base opacity-90", children: popupDescription }),
              !isSuccess ? /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [
                /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "email",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                        Input,
                        {
                          placeholder: emailPlaceholder,
                          type: "email",
                          ...field,
                          className: "h-14 text-base rounded-md border border-gray-300 focus:border-turquoise focus:ring-1 focus:ring-turquoise px-4"
                        }
                      ) }),
                      /* @__PURE__ */ jsx(FormMessage, { className: "text-red-500 text-sm mt-1" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "submit",
                    className: "w-full bg-[#C8AD8D] hover:bg-[#BDA079] text-white h-14 font-medium text-base rounded-md transition-colors duration-300",
                    disabled: isSubmitting,
                    children: buttonText
                  }
                )
              ] }) }) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-5 bg-green-50 rounded-md", children: /* @__PURE__ */ jsx("p", { className: "text-green-700 text-center", children: language === "es" ? "¡Gracias! Revisa tu correo electrónico para descargar el E-Book." : "Thank you! Check your email to download the E-Book." }) })
            ] })
          ]
        }
      )
    }
  ) });
};
const Home = () => {
  const { language } = useLanguage();
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const target = e.target;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if (href === "#") return;
        const targetElement = document.querySelector(href || "");
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: "smooth"
          });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);
  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const handleScroll = () => {
      if (window.scrollY > 50 && navbar) {
        navbar.classList.add("py-2");
        navbar.classList.remove("py-4");
      } else if (navbar) {
        navbar.classList.add("py-4");
        navbar.classList.remove("py-2");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", { className: "font-poppins text-charcoal bg-white", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: language === "es" ? "Eva Pérez | Consultora Wellness & Spa Manager para Hoteles de Lujo" : "Eva Pérez | Wellness Consultant & Spa Manager for Luxury Hotels",
        description: language === "es" ? "Transforma tu hotel con estrategias de wellness rentables. Eva Pérez, experta en gestión de spas, consultoría y hospitalidad de lujo." : "Transform your hotel with profitable wellness strategies. Eva Pérez specialises in spa management, consulting and luxury hospitality.",
        language
      }
    ),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("section", { id: "home", children: /* @__PURE__ */ jsx(Hero, {}) }),
    /* @__PURE__ */ jsx("section", { id: "about", children: /* @__PURE__ */ jsx(About, {}) }),
    /* @__PURE__ */ jsx("section", { id: "services", children: /* @__PURE__ */ jsx(Services, {}) }),
    /* @__PURE__ */ jsx("section", { id: "cta", children: /* @__PURE__ */ jsx(CallToAction, {}) }),
    /* @__PURE__ */ jsx("section", { id: "portfolio", children: /* @__PURE__ */ jsx(Portfolio, {}) }),
    /* @__PURE__ */ jsx("section", { id: "testimonials", children: /* @__PURE__ */ jsx(Testimonials, {}) }),
    /* @__PURE__ */ jsx("section", { id: "resources", children: /* @__PURE__ */ jsx(Resources, {}) }),
    /* @__PURE__ */ jsx("section", { id: "blog", children: /* @__PURE__ */ jsx(Blog, {}) }),
    /* @__PURE__ */ jsx("section", { id: "contact", children: /* @__PURE__ */ jsx(Contact, {}) }),
    /* @__PURE__ */ jsx("section", { id: "newsletter", children: /* @__PURE__ */ jsx(Newsletter, {}) }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsx(EbookPopup, {})
  ] }) });
};
const Home$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Home
}, Symbol.toStringTag, { value: "Module" }));
const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", { className: "font-poppins text-charcoal bg-white min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-grow container mx-auto px-4 py-24 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto prose prose-slate", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-playfair text-4xl font-bold mb-8 text-turquoise-dark", children: "Política de Privacidad" }),
      /* @__PURE__ */ jsx("p", { className: "lead", children: "En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016 (RGPD), y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales, te informamos sobre el tratamiento de tus datos personales." }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "1. Responsable del Tratamiento" }),
      /* @__PURE__ */ jsxs("p", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Identidad:" }),
        " Eva Pérez",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("strong", { children: "Actividad:" }),
        " Consultoría de Spa y Wellness",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("strong", { children: "Email de contacto:" }),
        " epm@epmwellness.com",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("strong", { children: "Ubicación:" }),
        " Madrid, España"
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "2. Finalidad del Tratamiento" }),
      /* @__PURE__ */ jsx("p", { children: "Tratamos la información que nos facilitas para las siguientes finalidades:" }),
      /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 mb-4", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Formulario de Contacto:" }),
          " Responder a tus consultas, solicitudes de auditoría o propuestas de colaboración."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Newsletter y Lead Magnets:" }),
          " Enviarte la guía gratuita solicitada y comunicaciones periódicas (newsletter) con contenidos sobre gestión de spas, novedades y servicios, siempre que hayas dado tu consentimiento explícito."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Gestión de Servicios:" }),
          " En caso de contratación, para la gestión administrativa, fiscal y contable de los servicios prestados."
        ] })
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "3. Legitimación" }),
      /* @__PURE__ */ jsx("p", { children: "La base legal para el tratamiento de tus datos es:" }),
      /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 mb-4", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Consentimiento:" }),
          " Al marcar la casilla de aceptación en nuestros formularios, nos autorizas expresamente a tratar tus datos."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Ejecución de un contrato:" }),
          " En caso de contratar servicios de consultoría o formación."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Interés legítimo:" }),
          " Para la respuesta a consultas pre-contractuales."
        ] })
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "4. Conservación de los Datos" }),
      /* @__PURE__ */ jsx("p", { children: "Los datos proporcionados se conservarán mientras se mantenga la relación comercial o durante los años necesarios para cumplir con las obligaciones legales. Los datos para el envío de newsletter se conservarán hasta que solicites tu baja." }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "5. Destinatarios" }),
      /* @__PURE__ */ jsx("p", { children: "Los datos no se cederán a terceros salvo en los casos en que exista una obligación legal. Utilizamos proveedores de servicios (como plataformas de email marketing o hosting) que pueden tener acceso a datos, garantizando siempre el cumplimiento del RGPD." }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "6. Derechos" }),
      /* @__PURE__ */ jsx("p", { children: "Tienes derecho a obtener confirmación sobre si estamos tratando tus datos personales y, por tanto, tienes derecho a:" }),
      /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 mb-4", children: [
        /* @__PURE__ */ jsx("li", { children: "Acceder a tus datos personales." }),
        /* @__PURE__ */ jsx("li", { children: "Rectificar los datos inexactos." }),
        /* @__PURE__ */ jsx("li", { children: "Solicitar su supresión cuando los datos ya no sean necesarios." }),
        /* @__PURE__ */ jsx("li", { children: "Limitar el tratamiento de tus datos." }),
        /* @__PURE__ */ jsx("li", { children: "Oponerte al tratamiento." }),
        /* @__PURE__ */ jsx("li", { children: "Portabilidad de tus datos." })
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Puedes ejercer tus derechos enviando un email a ",
        /* @__PURE__ */ jsx("strong", { children: "epm@epmwellness.com" }),
        "."
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] }) });
};
const Privacy$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Privacy
}, Symbol.toStringTag, { value: "Module" }));
const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", { className: "font-poppins text-charcoal bg-white min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-grow container mx-auto px-4 py-24 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto prose prose-slate", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-playfair text-4xl font-bold mb-8 text-turquoise-dark", children: "Términos y Condiciones" }),
      /* @__PURE__ */ jsx("p", { className: "lead", children: "Bienvenido/a a la web de Eva Pérez. Al acceder y utilizar este sitio web, aceptas cumplir con los siguientes términos y condiciones de uso." }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "1. Propiedad Intelectual" }),
      /* @__PURE__ */ jsx("p", { children: "Todo el contenido de este sitio web (textos, imágenes, diseños, logotipos, vídeos, material descargable, guías, etc.) es propiedad exclusiva de Eva Pérez o de terceros que han autorizado su uso. Está prohibida su reproducción, distribución, comunicación pública o transformación sin la autorización expresa y por escrito de la titular." }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "2. Uso del Sitio Web" }),
      /* @__PURE__ */ jsx("p", { children: "El usuario se compromete a utilizar el sitio web de conformidad con la ley, la moral, el orden público y estos Términos y Condiciones. Se prohíbe el uso del sitio web con fines ilícitos o lesivos contra Eva Pérez o terceros." }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "3. Contratación de Servicios" }),
      /* @__PURE__ */ jsx("p", { children: "Los servicios de consultoría, formación e interim management expuestos en la web están sujetos a presupuestos personalizados. La mera solicitud de información a través de los formularios no implica relación contractual hasta la firma de la propuesta de servicios correspondiente." }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "4. Exención de Responsabilidad" }),
      /* @__PURE__ */ jsx("p", { children: "Eva Pérez no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran derivarse de la disponibilidad y continuidad técnica del funcionamiento del sitio web. Asimismo, aunque se esfuerza por mantener la información actualizada y veraz, no garantiza la inexistencia de errores en los contenidos." }),
      /* @__PURE__ */ jsx("p", { children: 'La información proporcionada en el "Chatbot" o asistente virtual es de carácter orientativo y no sustituye una consultoría profesional personalizada.' }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "5. Enlaces Externos" }),
      /* @__PURE__ */ jsx("p", { children: "Este sitio web puede contener enlaces a sitios web de terceros. Eva Pérez no asume responsabilidad alguna por el contenido, políticas de privacidad o prácticas de dichos sitios web." }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "6. Modificaciones" }),
      /* @__PURE__ */ jsx("p", { children: "Nos reservamos el derecho a modificar, en cualquier momento y sin previo aviso, la presentación y configuración del sitio web, así como los presentes Términos y Condiciones." }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "7. Legislación Aplicable" }),
      /* @__PURE__ */ jsx("p", { children: "Estos términos se rigen por la legislación española. Para cualquier controversia que pudiera derivarse del acceso o uso del sitio web, las partes se someten a los juzgados y tribunales de la ciudad de Madrid (España)." })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] }) });
};
const Terms$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Terms
}, Symbol.toStringTag, { value: "Module" }));
const Cookies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", { className: "font-poppins text-charcoal bg-white min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-grow container mx-auto px-4 py-24 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto prose prose-slate", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-playfair text-4xl font-bold mb-8 text-turquoise-dark", children: "Política de Cookies" }),
      /* @__PURE__ */ jsx("p", { className: "lead", children: "Este sitio web utiliza cookies propias y de terceros para mejorar tu experiencia de usuario, analizar el tráfico y personalizar el contenido." }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "¿Qué son las cookies?" }),
      /* @__PURE__ */ jsx("p", { children: "Una cookie es un pequeño archivo de texto que se almacena en tu navegador cuando visitas casi cualquier página web. Su utilidad es que la web sea capaz de recordar tu visita cuando vuelvas a navegar por esa página." }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "Cookies que utilizamos" }),
      /* @__PURE__ */ jsx("h4", { className: "font-bold mt-4", children: "1. Cookies Técnicas (Necesarias)" }),
      /* @__PURE__ */ jsx("p", { children: "Son aquellas que permiten al usuario la navegación a través de la página web y la utilización de las diferentes opciones o servicios que en ella existan. Por ejemplo, controlar el tráfico, identificar la sesión o recordar elementos de un pedido." }),
      /* @__PURE__ */ jsx("h4", { className: "font-bold mt-4", children: "2. Cookies de Análisis" }),
      /* @__PURE__ */ jsx("p", { children: "Son aquellas que nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico de la utilización que hacen los usuarios del servicio. Para ello se analiza tu navegación en nuestra página web con el fin de mejorar la oferta de productos o servicios que te ofrecemos." }),
      /* @__PURE__ */ jsx("h4", { className: "font-bold mt-4", children: "3. Cookies de Preferencias" }),
      /* @__PURE__ */ jsx("p", { children: "Permiten recordar información para que el usuario acceda al servicio con determinadas características que pueden diferenciar su experiencia de la de otros usuarios, como, por ejemplo, el idioma o la configuración regional." }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mt-6 mb-2", children: "Gestión de Cookies" }),
      /* @__PURE__ */ jsx("p", { children: "Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador instalado en tu ordenador:" }),
      /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 mb-4", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Google Chrome:" }),
          " Configuración → Privacidad y seguridad → Cookies y otros datos de sitios."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Mozilla Firefox:" }),
          " Opciones → Privacidad y Seguridad."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Safari:" }),
          " Preferencias → Privacidad."
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Ten en cuenta que, si desactivas las cookies, es posible que algunas funciones del sitio web no funcionen correctamente." })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] }) });
};
const Cookies$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cookies
}, Symbol.toStringTag, { value: "Module" }));
const Booking = () => {
  const { language } = useLanguage();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "min-h-screen pt-24 pb-16 px-4",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5 },
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold text-gray-800 mb-4", children: language === "es" ? "Reserva una Consulta" : "Book a Consultation" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: language === "es" ? "Agenda una sesión personalizada con Eva Pérez para discutir tu proyecto de wellness o spa" : "Schedule a personalized session with Eva Pérez to discuss your wellness or spa project" })
        ] }),
        /* @__PURE__ */ jsx(BookingCalendar, {}),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 bg-gray-50 rounded-xl p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-800 mb-4", children: language === "es" ? "¿Qué esperar de la consulta?" : "What to expect from the consultation?" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-700 mb-2", children: language === "es" ? "Antes de la reunión" : "Before the meeting" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: language === "es" ? "Recibirás un correo electrónico de confirmación con un enlace para la videollamada y un cuestionario breve para comprender mejor tus necesidades." : "You will receive a confirmation email with a video call link and a brief questionnaire to better understand your needs." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-700 mb-2", children: language === "es" ? "Durante la consulta" : "During the consultation" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: language === "es" ? "Una conversación de 60 minutos donde analizaremos tu proyecto actual, identificaremos desafíos clave y exploraremos soluciones estratégicas." : "A 60-minute conversation where we will analyze your current project, identify key challenges, and explore strategic solutions." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-700 mb-2", children: language === "es" ? "Después de la sesión" : "After the session" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: language === "es" ? "Recibirás un resumen con las principales ideas discutidas y recomendaciones personalizadas para implementar en tu proyecto." : "You will receive a summary with the main ideas discussed and personalized recommendations to implement in your project." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-700 mb-2", children: language === "es" ? "Seguimiento" : "Follow-up" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: language === "es" ? "Tendrás acceso a una sesión de seguimiento breve por email para resolver cualquier duda adicional sobre las recomendaciones." : "You will have access to a brief follow-up session by email to resolve any additional questions about the recommendations." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 text-center text-gray-600 text-sm", children: [
          /* @__PURE__ */ jsx("p", { children: language === "es" ? "Para consultas sobre cancelaciones o cambios en tu reserva, por favor contacta directamente con nosotros por email." : "For inquiries about cancellations or changes to your booking, please contact us directly by email." }),
          /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-center", children: /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: "flex items-center gap-2 px-5 py-2 text-turquoise border-turquoise hover:bg-turquoise/10",
              children: [
                /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "m15 18-6-6 6-6" }) }),
                language === "es" ? "Volver a la página principal" : "Return to home page"
              ]
            }
          ) }) })
        ] })
      ] })
    }
  ) });
};
const Booking$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Booking
}, Symbol.toStringTag, { value: "Module" }));
const Admin = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState(null);
  const { toast: toast2 } = useToast();
  const formSchema2 = z.object({
    topic: z.string().min(5, {
      message: "El tema debe tener al menos 5 caracteres."
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      topic: ""
    }
  });
  const onSubmit = async (values) => {
    setIsGenerating(true);
    setGeneratedArticle(null);
    try {
      const response = await apiRequest({
        method: "POST",
        path: "/api/articles/generate",
        body: { topic: values.topic }
      });
      setGeneratedArticle(response.data);
      toast2({
        title: "Artículo generado con éxito",
        description: `El artículo "${response.data.title}" ha sido creado y publicado.`
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast2({
        title: "Error",
        description: "No se pudo generar el artículo. Verifica la configuración de OpenAI.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "container mx-auto py-24 px-4", children: /* @__PURE__ */ jsxs(Card, { className: "max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-playfair", children: "Generador de Artículos con IA" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Introduce un tema para generar automáticamente un artículo de blog optimizado para SEO y publicarlo." })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "topic",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Tema del Artículo" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Ej: Tendencias de bienestar en hoteles de lujo 2025", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full bg-turquoise hover:bg-turquoise-dark", disabled: isGenerating, children: isGenerating ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Generando contenido..."
        ] }) : "Generar y Publicar" })
      ] }) }),
      generatedArticle && /* @__PURE__ */ jsxs("div", { className: "mt-8 p-4 bg-green-50 rounded-lg border border-green-200", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-green-800 mb-2", children: "¡Artículo Publicado!" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-green-700 mb-2", children: [
          /* @__PURE__ */ jsx("strong", { children: "Título:" }),
          " ",
          generatedArticle.title
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-green-700", children: [
          /* @__PURE__ */ jsx("strong", { children: "Slug:" }),
          " ",
          generatedArticle.slug
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx("a", { href: "/#blog", className: "text-turquoise hover:underline text-sm font-medium", children: "Ver en el blog →" }) })
      ] })
    ] })
  ] }) });
};
const Admin$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Admin
}, Symbol.toStringTag, { value: "Module" }));
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
const Auth = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AuthPage
}, Symbol.toStringTag, { value: "Module" }));
function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params == null ? void 0 : params.slug;
  const { t, language } = useLanguage();
  const { data: article, isLoading } = useQuery({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug
  });
  const articleLanguage = (article == null ? void 0 : article.language) === "en" ? "en" : "es";
  useEffect(() => {
    if (!article) return;
    document.documentElement.lang = articleLanguage;
    return () => {
      document.documentElement.lang = language;
    };
  }, [article, articleLanguage, language]);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen pt-24 pb-16 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-32 mb-8" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "aspect-video w-full rounded-2xl" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-24 rounded-full" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-32" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-24" })
        ] }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-3/4" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-8", children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-5/6" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" })
        ] })
      ] })
    ] }) });
  }
  if (!article) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pt-24 container mx-auto px-4 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-4", children: "Artículo no encontrado / Article not found" }),
      /* @__PURE__ */ jsx(Link, { href: "/#blog", children: /* @__PURE__ */ jsxs(Button, { children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Volver / Back"
      ] }) })
    ] });
  }
  const siteUrl = "https://www.epmwellness.com";
  const postUrl = `/blog/${article.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "image": article.image.startsWith("http") ? article.image : `${siteUrl}${article.image}`,
    "datePublished": article.date,
    "author": {
      "@type": "Person",
      "name": "Eva Pérez"
    },
    "publisher": {
      "@type": "Person",
      "name": "Eva Pérez",
      "image": {
        "@type": "ImageObject",
        "url": `${siteUrl}/attached_assets/foto_perfil_Eva_Linkedin.PNG`
      }
    },
    "description": article.excerpt
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: article.title,
        description: article.excerpt,
        image: article.image,
        url: postUrl,
        type: "article",
        language: articleLanguage
      }
    ),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(structuredData) }),
    /* @__PURE__ */ jsx("article", { className: "min-h-screen pt-24 pb-16 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
      /* @__PURE__ */ jsx(Link, { href: "/#blog", children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "mb-8 hover:bg-transparent p-0 flex items-center text-muted-foreground hover:text-primary transition-colors", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        language === "es" ? "Volver al Blog" : "Back to Blog"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: article.image,
            alt: article.title,
            className: "object-cover w-full h-full"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { className: "bg-primary/10 text-primary px-3 py-1 rounded-full font-medium", children: article.category }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(Calendar$1, { className: "h-4 w-4 mr-1" }),
            new Date(article.date).toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 mr-1" }),
            article.readTime
          ] })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-playfair font-bold text-foreground leading-tight", children: article.title }),
        /* @__PURE__ */ jsx("div", { className: "prose prose-lg dark:prose-invert max-w-none font-sans leading-relaxed", children: /* @__PURE__ */ jsx(ReactMarkdown, { children: article.content }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-12 p-8 bg-muted/30 rounded-2xl border border-primary/10", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-6 items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-center md:text-left", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-playfair font-bold text-foreground", children: language === "es" ? "¿Tu Spa está alcanzando su máximo potencial?" : "Is your Spa reaching its full potential?" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: language === "es" ? "Solicita una auditoría estratégica gratuita y descubre oportunidades ocultas de rentabilidad." : "Request a free strategic audit and discover hidden profitability opportunities." })
          ] }),
          /* @__PURE__ */ jsx(AuditModal, { source: "blog_article", children: /* @__PURE__ */ jsx(Button, { size: "lg", className: "shrink-0 bg-primary text-primary-foreground hover:bg-primary/90", children: language === "es" ? "Solicitar Auditoría" : "Request Audit" }) })
        ] }) })
      ] })
    ] }) })
  ] });
}
const BlogPostPage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BlogPostPage
}, Symbol.toStringTag, { value: "Module" }));
export {
  render
};
