// const Quiz = artifacts.require('game')
// const assert = require('assert')


const quiz = artifacts.require('Quiz')
const assert = require('assert')
 
let contractInstance
 
contract('quiz', (accounts) => {
    const moderator = accounts[0];
    const player1 = accounts[1];
    const player2 = accounts[2];
    const player3 = accounts[3];
    const player4 = accounts[4];
    const player5 = accounts[5];

    beforeEach(async () => {
        contractInstance = await quiz.deployed({ from: moderator });
    })

    describe("Constructor Testing", () => {

        describe ("Contract Assertion", () => {
            it("Contract Deployment Test", async () => {
                // const instance = await Quiz.new(2, 1, {from : moderator});
                assert(contractInstance != null);
                fees = await contractInstance.regpfee.call()
                // assert(totalplayers.toNumber(), 2, "Value of Total number of allowable players verified")
                assert(fees, 20, "Value of Fees verified")
            });
        })

        describe("Fail case", () => {
			it("should revert on invalid from address", async () => {
				try {
					const instance = await quiz.new(2, 3, {from: "lol"});
					assert.fail("Should have thrown an error in the above line");
                } 
                catch (err) {
					assert.equal(err.message, "invalid address");
				}
			});
        })

    })

    describe("[1] Player Testing", () => {
		describe("Success Case", () => {
			it("1 Player can successfully register and event is emitted", async () => {
                let result = await contractInstance.registerplayers.call([1, 2, 3, 4], { from: player1, value: web3.toWei(20, 'wei') });
                // console.log(result)
                // val = await result.curr_len.call()
				assert.equal(result.toNumber(), 1, "Num of Players should be 1");
			});
        })
        describe("Fail case", () => {
            it("Player can NOT successfully register if he's moderator", async () => {
                try {
                    let result = await contractInstance.registerplayers.call([1, 2, 3, 4], { from: moderator, value: web3.toWei(20, 'wei') });
                    assert.fail("VM Exception while processing transaction: revert");
                    // assert.equal(result.toNumber(), 1, "Num of Players should be 1");
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        })

    });

    describe("[2] Player Testing", () => {
        describe("Success Case", () => {
            it("1 Player can successfully register and event is emitted", async () => {
                let result = await contractInstance.registerplayers.call([1, 2, 3, 4], { from: player1, value: web3.toWei(20, 'wei') });
                // console.log(result)
                // val = await result.curr_len.call()
                assert.equal(result.toNumber(), 1, "Num of Players should be 1");
            });
        })
        describe("Fail case", () => {
            it("Player can NOT successfully register if he's entering answers other than {1,2,3,4} and 0 for pass", async () => {
                try {
                    let result = await contractInstance.registerplayers.call([5, 2, 3, 4], { from: player1, value: web3.toWei(20, 'wei') });
                    assert.fail("VM Exception while processing transaction: revert");
                    // assert.equal(result.toNumber(), 1, "Num of Players should be 1");
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        })
    });


    describe("[3] Player Testing", () => {
        describe("Success Case", () => {
            it("1 Player can successfully register and event is emitted", async () => {
                let result = await contractInstance.registerplayers.call([1, 2, 3, 4], { from: player1, value: web3.toWei(20, 'wei') });
                // console.log(result)
                // val = await result.curr_len.call()
                assert.equal(result.toNumber(), 1, "Num of Players should be 1");
            });
        })
        describe("Fail case", () => {
            it("Player can NOT successfully register if his registration fee doesn't match actual registration fee", async () => {
                try {
                    let result = await contractInstance.registerplayers.call([1, 2, 3, 4], { from: player1, value: web3.toWei(20, 'wei') });
                    assert.fail("VM Exception while processing transaction: revert");
                    // assert.equal(result.toNumber(), 1, "Num of Players should be 1");
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        })
    });

});



        // describe("Fail case", () => {
        //     it("Owner can't register as player", async () => {
        //         try {
        //             let result = await contractInstance.registerplayers.call([1, 2, 3, 4], { from: player1, value: web3.toWei(20, 'wei') });
        //             assert.fail("Quiz master can't play the game");
        //         } 
        //         catch (err) {
        //             assert.equal(err.message, "Quiz master can't play the game");
        //         }
        //     });

        //     it("Unacceptable registration fee [ greater ]", async () => {
        //         try {
        //             let result = await contractInstance.registerplayers.call([1, 2, 3, 4], { from: player1, value: web3.toWei(21, 'wei') });
        //             assert.fail("VM Exception while processing transaction: revert");
        //         } 
        //         catch (err) {
        //             assert.equal(err.message, "VM Exception while processing transaction: revert");
        //         }
        //     });


        //     it("Unacceptable registration fee [ lower ]", async () => {
        //         try {
        //             let result = await contractInstance.registerplayers.call([1, 2, 3, 4], { from: player1, value: web3.toWei(12, 'wei') });
        //             assert.fail("VM Exception while processing transaction: revert");
        //         } 
        //         catch (err) {
        //             assert.equal(err.message, "VM Exception while processing transaction: revert");
        //         }
        //     });

        //     it("Unacceptable Answers", async () => {
        //         try {
        //             let result = await contractInstance.registerplayers.call([1, 2253, 3, 45], { from: player1, value: web3.toWei(20, 'wei') });
        //             assert.fail("VgM Exception while processing transaction: revert");
        //         } 
        //         catch (err) {
        //             assert.equal(err.message, "VM Exception while processing transaction: revert");
        //         }
        //     });


        // })