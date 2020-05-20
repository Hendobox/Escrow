import Web3 from "web3"; 

const initWeb3 = () => {
	return new Promise((resolve, reject) => {
		window.addEventListener("load", async () => {
			if(typeof window.ethereum !== 'undefined') {
			const web3 = new Web3(window.ethereum);
			window.ethereum.enable()
				.then(() => {
					resolve(
						new Web3(window.ethereum)
					);
				})
				.catch(e => {
					reject(e);
				});
			return;
		}

			if(typeof window.web3 !== 'undefined') {
			return resolve(
				new Web3(window.web3.currentProvider)
			);
		}
		resolve(new Web3('http://localhost:9545'));
		});
	});
};

export { initWeb3 };
