const Escrow = artifacts.require('Escrow');

contract('Escrow', (accounts) => {
	let escrow= null;
	const [lawyer, payer, recipient] = accounts;
	before(async () => {
		escrow = await Escrow.deployed();
	});

	it('Should check balance of smart contract', async () => {
		const balance = await web3.eth.getBalance(escrow.address);
		const balanceFunction = await escrow.balance();
		assert(parseInt(balance) === parseInt(balanceFunction));
	});

	it('Should make deposits', async () => {
		await escrow.deposit({from: payer, value: 900});
		const balance = await web3.eth.getBalance(escrow.address);
		assert(parseInt(balance) === 900);
	});

	it('Should NOT deposit if sender is not payer', async () => {
		try {
			await escrow.deposit({from: recipient, value: 101});
		} catch (e) {
			assert(e.message.includes('Only payer can make deposits'));
			return;
		}
		assert(false);
	});

	it('Should NOT deposit if value is more than amount', async () => {
		try {
			await escrow.deposit({from: payer, value: 1001});
		} catch (e) {
			assert(e.message.includes('Cannot deposit more than specified amount'));
			return;
		}
		assert(false);
	});

	it('Should NOT release funds if sender is not lawyer', async () => {
		try {
			await escrow.release({from: accounts[3]});
		} catch (e) {
			assert(e.message.includes('Only lawyer can release funds'));
			return;
		} 
		assert(false);
	});

	it('Should NOT release funds if balance is lower than specified amount', async () => {
		try {
			await escrow.release({from: lawyer});
		} catch (e) {
			assert(e.message.includes('Cannot release incomlete amount'));
			return;
		}
		assert(false);
	});

	it('Should release funds', async () => {
		await escrow.deposit({from: payer, value: 100});
		const recipientInitialBalance = web3.utils.toBN(await web3.eth.getBalance(recipient));
		await escrow.release({from: lawyer});
		const recipientFinalBalance = web3.utils.toBN(await web3.eth.getBalance(recipient));
		assert(recipientFinalBalance.sub(recipientInitialBalance).toNumber() === 1000);
	});
});