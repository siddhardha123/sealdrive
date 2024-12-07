import { useEffect, useState } from "react"

export function useToast() {
    const [toasts, setToasts] = useState<
        { id: string; title: string; description?: string; variant?: "default" | "destructive" }[]
    >([])

    const toast = ({
                       title,
                       description,
                       variant = "default",
                   }: {
        title: string
        description?: string
        variant?: "default" | "destructive"
    }) => {
        const id = Math.random().toString(36).substr(2, 9)
        setToasts((prevToasts) => [...prevToasts, { id, title, description, variant }])
    }

    useEffect(() => {
        if (toasts.length > 0) {
            const timer = setTimeout(() => {
                setToasts((prevToasts) => prevToasts.slice(1))
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [toasts])

    return { toast, toasts }
}

