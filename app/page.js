"use client"
import {useEffect} from "react"
import {useRouter} from "next/navigation"

const Index = () => {
    const router = useRouter();
    useEffect(() => {
        router.push("/auctions")
    }, [router])
    return <div>Cargando...</div>
}

export default Index;