describe ('API testing on Trello boards', ()=>{

    let dataNames
    let idBoardOne
    let idListOne
    let idCardOne

    before( function() {
        cy.fixture('names')
        .then( function(data) {
            dataNames = data
        })
    })

    it('should connect Trello API and get board-one', () => {
        //token 2ea03b4c5317fc877fed99279daea0f2a3f4cd81355baf482e51dd1897504787
        cy.request('https://api.trello.com/1/members/me/boards?key=3cdd706ac88f1d2e14ccb61ed3e4057f&token=2ea03b4c5317fc877fed99279daea0f2a3f4cd81355baf482e51dd1897504787')
         .then(res => {
            for(let board in res.body){
                if(res.body[board].name === dataNames.boardOneName){
                    idBoardOne = res.body[board].id
                    expect(res.body[board].name).eq(dataNames.boardOneName)
                }
            }
        })
    })

    it('should have two lists "column-one" and "column-two"', () => {
        cy.request(`https://api.trello.com/1/boards/${idBoardOne}/lists?key=3cdd706ac88f1d2e14ccb61ed3e4057f&token=2ea03b4c5317fc877fed99279daea0f2a3f4cd81355baf482e51dd1897504787`)
        .then(res => {
            expect(res.body).to.have.length(2)
            expect(res.body[0].name).to.eq(dataNames.columnOneName)
            expect(res.body[1].name).to.eq(dataNames.columnTwoName)
            idListOne = res.body[0].id
        })
    })

    it('should have "card-one" and "card-two" in "column-one"', () => {
        cy.request(`https://api.trello.com/1/lists/${idListOne}/cards?key=3cdd706ac88f1d2e14ccb61ed3e4057f&token=2ea03b4c5317fc877fed99279daea0f2a3f4cd81355baf482e51dd1897504787`)
        .then(res => {
                expect(res.body[0]).to.deep.include({'name':dataNames.cardOneName})
                idCardOne = res.body[0].id
                expect(res.body[1]).to.deep.include({'name':dataNames.cardTwoName})
        })
    })

    it('should delete and not find "card-one" from "column-one"', () => {
        cy.request('DELETE',`https://api.trello.com/1/cards/${idCardOne}?key=3cdd706ac88f1d2e14ccb61ed3e4057f&token=2ea03b4c5317fc877fed99279daea0f2a3f4cd81355baf482e51dd1897504787`)
        cy.request(`https://api.trello.com/1/lists/${idListOne}/cards?key=3cdd706ac88f1d2e14ccb61ed3e4057f&token=2ea03b4c5317fc877fed99279daea0f2a3f4cd81355baf482e51dd1897504787`)
        .then(res => {
                for(let card in res.body){
                    expect(res.body[card]).to.not.deep.include({'id':idCardOne})
                }
        })

        cy.request('POST', `https://api.trello.com/1/cards?idList=${idListOne}&key=3cdd706ac88f1d2e14ccb61ed3e4057f&token=2ea03b4c5317fc877fed99279daea0f2a3f4cd81355baf482e51dd1897504787`, {
            'name': dataNames.cardOneName,
            'pos': 'top'
        })
    })
})