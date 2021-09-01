const customEmojis = [
    {
        name: 'octocat',
        short_names: ['octocat'],
        text: '',
        emoticons: [],
        keywords: ['github'],
        imageUrl:
            'https://github.githubassets.com/images/icons/emoji/octocat.png',
        customCategory: 'GitHub'
    },
    {
        name: 'vitaliy',
        short_names: ['vitaliy'],
        text: '',
        emoticons: [],
        keywords: ['vitaliy'],
        imageUrl: '/assets/logo.png',
        customCategory: 'Github'
    }
]

const emojisMap: { [key: string]: string } = {}

customEmojis.forEach(emoji => {
    emojisMap[emoji.name] = emoji.imageUrl
})

export { customEmojis, emojisMap }
