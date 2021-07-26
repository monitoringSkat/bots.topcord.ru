import React, { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import AuthContext from '../context/auth.context'

function PageWithAuth(Page: React.FC<any>) {
    return (props: any) => {
        const router = useRouter()
        const { user, login } = useContext(AuthContext)
        useEffect(() => {
            if (user.id) return
            login().then(loggedIn => {
                if (!loggedIn) return router.push('/')
            })
        }, [user.id])

        return <Page {...props} />
    } 
}

export default PageWithAuth
