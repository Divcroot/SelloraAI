import { useEffect } from "react"
import axios from "axios"
import api from "@/utils/axios"
import { useUserStore } from "@/store/store"

export const useGetCurrentUser = () => {
    const setUser = useUserStore((s) => s.setUser);
    const setAdmin = useUserStore((s) => s.setAdmin);
    const setPartner = useUserStore((s) => s.setPartner);
    const setLoading = useUserStore((s) => s.setLoading);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const fetchUser = async () => {
            try {
                const { data } = await api.get('/api/user/me', { signal });
                setUser(data.success ? data.user : null);
            } catch (error) {
                if (axios.isCancel(error)) return
                console.error('client current user fetching error: ', error)
                setUser(null)
            }
        }

        const fetchAdmin = async () => {
            try {
                const { data } = await api.get('/api/auth/admin', { signal })
                setAdmin(data.success ? data.admin : null)
            } catch (error) {
                if (axios.isCancel(error)) return
                // 401/403 just means "not an admin", so it isn't worth logging
                const status = axios.isAxiosError(error) ? error.response?.status : undefined
                if (status !== 401 && status !== 403) {
                    console.error('client admin fetching error: ', error)
                }
                setAdmin(null)
            }
        }

        const fetchPartner = async () => {
            try {
                const { data } = await api.get('/api/auth/partner', { signal })
                setPartner(data.success ? data.partner : null)
            } catch (error) {
                if (axios.isCancel(error)) return
                const status = axios.isAxiosError(error) ? error.response?.status : undefined
                if (status !== 401 && status !== 403 && status !== 404) {
                    console.error('client partner fetching error: ', error)
                }
                setPartner(null)
            }
        }

        const init = async () => {
            await Promise.allSettled([fetchUser(), fetchAdmin(), fetchPartner()])
            if (!signal.aborted) setLoading(false)
        }

        init()

        return () => controller.abort()
    }, [setUser, setAdmin, setPartner, setLoading])
}