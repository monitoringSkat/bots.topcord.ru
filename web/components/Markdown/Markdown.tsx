import { FC } from "react"
import ReactMarkdown from "react-markdown"
import gfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface Props {
    text: string
    className?: string
}

const Markdown: FC<Props> = ({ text, className }) => 
    <ReactMarkdown 
        rehypePlugins={[rehypeRaw]} 
        remarkPlugins={[gfm]} 
        className={className} 
        children={text} 
    />


export default Markdown