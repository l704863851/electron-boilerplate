module.exports = () => ({
    before: [
        require('ts-import-plugin')({
            libraryName: 'antd',
            style: true
        })
    ]
});
