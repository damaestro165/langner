"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex gap-4 items-start">
              <div className="mt-0.5">
                {props.variant === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                {props.variant === 'destructive' && <AlertCircle className="h-5 w-5 text-red-600" />}
                {props.variant === 'default' && <Info className="h-5 w-5 text-blue-600" />}
              </div>
              <div className="grid gap-1">
                {title && <ToastTitle className="text-base font-bold">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-sm font-medium opacity-80">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
