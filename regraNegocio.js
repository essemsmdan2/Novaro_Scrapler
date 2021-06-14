// Escolher um Siroma Ice Tea +20 DEX


// confira os itens necessários para fabricar: 1 manage pot, 2 Cold Ice, 3 Blood of Wolf
const regraNegocio = {
    ObjFoods: {
        "Warg Blood Cocktail": {

            id: 12430,
            marketPrice: 15999,

            ArrRecipe: [

                {
                    name: "Cold Ice",
                    id: 6253,
                    count: 2,
                    value: 3050
                },
                {
                    name: "Blood of Wolf",
                    id: 6252,
                    count: 2,
                    value: 4998
                }, {
                    name: "Melage Pot",
                    id: 6248,
                    count: 1,
                    value: 300
                }
            ]
        }
    },

    valorTotal: function (Obj, foodName) {
        let Arfoods = Obj[foodName]["ArrRecipe"];
        let itemSoma = 0;
        let marketPrice = {};
        marketPrice["Market Price"] = Obj[foodName]["marketPrice"];
        let fabricPrice = {};
        let ArrResult = []
        ArrResult.push(foodName);
        Arfoods.forEach(item => {

            itemSoma = itemSoma + (item.value * item.count);

        });

        fabricPrice["Fabric Price"] = itemSoma;


        //verificar o valor de mercado
        ArrResult.push(fabricPrice, marketPrice);
        //Verificar se o Valor do Mercado é lucro ou Perda


        ArrResult.push(lucroOuPerda(fabricPrice["Fabric Price"], marketPrice["Market Price"]));





        //Retornar
        return ArrResult;
    },
    //calcular valor total de ingredientes
    lucroOuPerda: function (valorFabrica, valorVenda) {
        let porcentagem = 0;
        let variacao = 0;
        if (valorFabrica > valorVenda) {
            variacao = valorVenda - valorFabrica;
            porcentagem = Math.floor((valorFabrica - valorVenda) * 100 / valorVenda);
            return `Perda de ${porcentagem}% total Perda = ${variacao}z`;

        } else {
            variacao = valorVenda - valorFabrica;
            porcentagem = Math.floor((valorVenda - valorFabrica) * 100 / valorFabrica);
            return `Lucro de ${porcentagem}% total Lucro = ${variacao}z`;
        }

    }


}









//Resultado com o valor para fabricação/ Valor Venda / Lucro ou Prejuizo / Valor do Lucro ou Prejuizo
//const WargBloodCocktail = valorTotal(ObjFoods, "Warg Blood Cocktail");
//console.log(WargBloodCocktail);


module.exports = {
    regraNegocio,

}