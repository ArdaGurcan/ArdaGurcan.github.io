const sendEthButton = document.querySelector('.sendEthButton');

let accounts = [];

sendEthButton.addEventListener('click', () => {
  getAccount().then(()=>{
    ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: accounts[0],
          to: '0x4ac92adfe29093783a39fc97ef1D8A9DC51C312E',
          value: '0x044D575B885F0000',
          gasPrice: '0x09184e72a000',
          gas: '0x2710',
        },
      ],
    })
    .then((txHash) => console.log(txHash))
    .catch((error) => console.error);
  


});})

async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
}