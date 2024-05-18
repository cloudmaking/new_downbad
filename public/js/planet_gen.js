document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    const main = document.querySelector('main');
    const url = "https://docs.google.com/spreadsheets/d/1a6WnoHginIXTNY9pLfnitNUdRCCekpb_sAjDnyqGp5w/export?format=csv";

    fetch(url)
        .then(result => result.text())
        .then(csvtext => {
            console.log("Fetched CSV data");
            Papa.parse(csvtext, {
                header: true,
                complete: (results) => {
                    console.log("Parsed CSV data", results.data);
                    window.nftData = results.data; // Store data globally
                }
            });
        })
        .catch(error => {
            console.error("Error fetching and parsing CSV data:", error);
        });

    function initializeNFTData(nft_number) {
        console.log("Initializing NFT data");
        const nftData = window.nftData.find(item => item.Tokenname === nft_number);

        if (nftData) {
            console.log("NFT Data found:", nftData);
            document.getElementById("nft_name").innerText = nftData.Tokenname;
            document.getElementById("nft_collection").innerText = 'Lost Planets';
            document.getElementById("nft_policy").innerText = nftData.PolicyId;
            document.getElementById("nft_ipfs").innerText = nftData.IpfsHash;
            document.getElementById("nft_uid").innerText = nftData.Uid;
            document.getElementById("nft_minted").innerText = nftData.Minted;

            // Hardcoding the links
            const collectionBuyLink = "07af7246f3f1409cb06a831f4fbf8d29&n=";
            const collectionSaleLink = "07af7246f3f1409cb06a831f4fbf8d29&c=";
            const collectionWebsite = "https://www.downbad.cloud/lost-planets";

            document.getElementById("collection_buy_link").innerText = collectionBuyLink;
            document.getElementById("collection_sale_link").innerText = collectionSaleLink;
            document.getElementById("collection_website").innerText = collectionWebsite;

            const nft_name = nftData.Tokenname;
            const nft_ipfs = nftData.IpfsHash;
            const nft_minted = nftData.Minted;

            document.getElementById("dispName").innerHTML = `#${nft_name}`;

            document.getElementById("nft_display").src = `https://c-ipfs-gw.nmkr.io/ipfs/${nft_ipfs}`;
            let nft_Uid = nftData.Uid.replace(/-/g, "");

            if (nft_minted === "FALSE") {
                const nft_buy_link = `https://pay.nmkr.io/?p=07af7246f3f1409cb06a831f4fbf8d29&n=${nft_Uid}`;
                document.getElementById("buyNFT").style.backgroundColor = "var(--pop)";
                document.getElementById("buyNFT").innerHTML = "Buy this NFT!";
                document.getElementById("buyNFT").href = nft_buy_link;
            } else {
                document.getElementById("buyNFT").style.backgroundColor = "var(--highlight)";
                document.getElementById("buyNFT").innerHTML = "NFT Sold, Check External Markets.";
            }
        } else {
            console.error("No NFT data found for the given number");
        }
    }

    window.randomize = function () {
        const randomNumber = Math.floor(Math.random() * 10000) + 1;
        //console.log("Generated random number:", randomNumber);
        document.getElementById("nft_number").value = randomNumber;
        changeRangeValue(randomNumber);
    }

    window.changeRangeValue = function (val) {
        //console.log("Change range value:", val);
        document.getElementById("nft_slider").value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    }

    window.changeInputValue = function (val) {
        //console.log("Change input value:", val);
        document.getElementById("nft_number").value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    }

    document.getElementById("random").addEventListener("click", (event) => {
        event.preventDefault();
        //console.log("Random button clicked");
        randomize();
        // also clci the submit button
        document.getElementById("submit-btn").click();
    });

    document.getElementById("submit-btn").addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Submit button clicked");
        const nftNumber = document.getElementById('nft_number').value;
        initializeNFTData(nftNumber);
    });

    document.getElementById("nft_slider").addEventListener("input", function() {
        changeInputValue(this.value);
    });

    document.getElementById("nft_number").addEventListener("input", function() {
        changeRangeValue(this.value);
    });

    window.openPaymentWindow = (link) => {
        console.log("Open payment window for link:", link);
        const paymentUrl = `https://pay.nmkr.io/?p=07af7246f3f1409cb06a831f4fbf8d29&c=${link}`;

        const popupWidth = 500;
        const popupHeight = 700;
        const left = window.top.outerWidth / 2 + window.top.screenX - (popupWidth / 2);
        const top = window.top.outerHeight / 2 + window.top.screenY - (popupHeight / 2);

        const popup = window.open(paymentUrl, "NFT-MAKER PRO Payment Gateway", `popup=1, location=1, width=${popupWidth}, height=${popupHeight}, left=${left}, top=${top}`);

        document.body.style = "background: rgba(0, 0, 0, 0.5)";

        const backgroundCheck = setInterval(() => {
            if (popup.closed) {
                clearInterval(backgroundCheck);
                console.log("Popup closed");
                document.body.style = "";
            }
        }, 1000);
    };
});
