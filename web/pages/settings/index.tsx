import SettingsLayout from '../../layout/settings-layout'
import styles from '../../styles/pages/settings.module.scss'
import Input from '../../components/Input/Input'
import { useContext } from 'react'
import AuthContext from '../../context/auth.context'
const SettingsPage = () => {

    const { user } = useContext(AuthContext)
    return (
        <SettingsLayout>
            <h3>Моя учётная запись</h3>
            <div className={styles.profile}>
                <img
                    className={styles.avatar}
                    src={user.avatar}
                />
                <div style={{ width: '100%' }}>
                    <div className={styles.header}>
                        <div className={styles.username}>
                            {user.username}<span>#{user.discriminator}</span>
                        </div>
                        <button>Редактировать профиль</button>
                    </div>
                    {/* <Input placeholder="Максимальная длина 250 сиволов." type="textarea" /> if edit true  */}
                    <div className={styles.bio}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Eius, inventore officia! Error doloremque
                        molestias, eius dolore, voluptas, praesentium non quam
                        modi minima eos fugit amet id! Accusamus autem
                        voluptatem eius! Dolores, ipsam. Natus a, dicta fugiat
                        quis dignissimos alias vitae similique labore eaque
                        incidunt soluta harum ratione vero voluptatibus! Enim
                        aliquam laborum nisi omnis voluptates ipsa pariatur odit
                        eveniet porro? Reprehenderit assumenda facere porro
                        eveniet non natus qui at perspiciatis doloremque!
                        Voluptatum doloribus placeat
                    </div>
                    <button className={styles.save}>Сохранить изменения</button>
                </div>
            </div>
            <h4>Интеграции</h4>
        </SettingsLayout>
    )
}

export default SettingsPage
