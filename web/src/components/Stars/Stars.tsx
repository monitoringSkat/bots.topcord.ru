import React from 'react'
import styles from './Stars.module.scss'

interface Props {
    max?: number
    count: number
    onClick?: (current: number) => void
}

const Stars: React.FC<Props> = ({ max = 5, count, onClick }) => (
    <div className={styles.stars}>
        {Array.from({ length: max }).map((_, i) => (
            <img
                onClick={() => onClick?.(i + 1)}
                src={i < count ? '/assets/star-active.svg' : '/assets/star.svg'}
            />
        ))}
    </div>
)

export default Stars
