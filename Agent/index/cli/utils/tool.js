const table_config = {
    // borderColor : "gray",
    border: {
        topBody: `═`,
        topJoin: `╤`,
        topLeft: `╔`,
        topRight: `╗`,

        bottomBody: `═`,
        bottomJoin: `╧`,
        bottomLeft: `╚`,
        bottomRight: `╝`,

        bodyLeft: `║`,
        bodyRight: `║`,
        bodyJoin: `│`,

        joinBody: `─`,
        joinLeft: `╟`,
        joinRight: `╢`,
        joinJoin: `┼`
    },
    columnDefault: {
        //   width: 1,
        paddingLeft: 1,
        paddingRight: 1,
        alignment: "center",
        verticalAlignment: 'middle'
    },
    columns: [
        // { alignment: 'center' },
        // { alignment: 'center' },
        // { alignment: 'center' },
    ],
};

const border_color = "#454545"
let border_keys = Object.keys(table_config.border)
border_keys.forEach(key => {
    let border = table_config.border[`${key}`]
    table_config.border[`${key}`] = `{${border_color}-fg}` + border + "{/}"
})


export { table_config }