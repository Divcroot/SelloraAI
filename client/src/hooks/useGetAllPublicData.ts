import { useEffect } from "react";
import axios from "axios";
import api from "@/utils/axios";
import { usePublicStore } from "@/store/store";

export const useGetAllPublicData = () => {
    const setAllPublicPartners = usePublicStore((s) => s.setAllPublicPartners);
    const setAllPublicProducts = usePublicStore((s) => s.setAllPublicProducts);
    const setAllOrders = usePublicStore((s) => s.setAllOrders);
    const setLoading = usePublicStore((s) => s.setLoading);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const getAllPartners = async () => {
            try {
                const { data } = await api.get('/api/auth/partners', { signal });
                setAllPublicPartners(data.success ? data.partners : []);
            } catch (error) {
                if (axios.isCancel(error)) return;
                console.error('client all public partners fetching error: ', error);
                setAllPublicPartners([]);
            }
        }

        const getAllProducts = async () => {
            try {
                const { data } = await api.get('/api/public-product/all-public', { signal });
                setAllPublicProducts(data.success ? data.products : []);
            } catch (error) {
                if (axios.isCancel(error)) return;
                console.error('client all public products fetching error: ', error);
                setAllPublicProducts([]);
            }
        }

        const getAllOrders = async () => {
            try {
                const { data } = await api.get('/api/order/all', { signal });
                setAllOrders(data.success ? data.orders : []);
            } catch (error) {
                if (axios.isCancel(error)) return;
                console.error('client all orders fetching error: ', error);
                setAllOrders([]);
            }
        }

        const init = async () => {
            await Promise.allSettled([getAllPartners(), getAllProducts(), getAllOrders()]);
            if (!signal.aborted) setLoading(false);
        }

        init();

        return () => controller.abort();
    }, [setAllPublicPartners, setAllPublicProducts, setAllOrders, setLoading]);
}