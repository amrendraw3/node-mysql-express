const DB = require("../config/db")["sqlConn"]();
const UserAccountOwnershipRequest = require("../models/user-account-ownership-requests");
const LastScanBlock = require("../models/ethereum-last-scan-blocks");
const User = require("../models/users");
const Member = require("../models/member");
const Request = require('request-promise');
const KEYS = require("../config/keys")[process.env.NODE_ENV || "local"];

verifyPendingRequests = async () => {
	console.log('started job: verifyAddressRequest verifyPendingRequests');
	const pendingRequests = await UserAccountOwnershipRequest.getAllPendingRequests();

	let pendingRequest = null;
	let isRequestExpired = false;
	let requestsToVerify = [];

	console.log('verifyPendingRequests: pendingRequests: ', pendingRequests);
	if(pendingRequests.length > 0) {
		for(let i = 0; i < pendingRequests.length; i++) {
			pendingRequest = pendingRequests[i];
			isRequestExpired = await expireRequestIfRequired(pendingRequest);
			if(!isRequestExpired) {
				requestsToVerify.push(pendingRequest);
			}
		}
		console.log('verifyPendingRequests: requestsToVerify: ', requestsToVerify.length);
		await scanAddressTransactions(requestsToVerify);
	}
	console.log('ended job: verifyAddressRequest verifyPendingRequests');
	return null;
}

expireRequestIfRequired = async (pendingRequest) => {
	const timediff = await helper.timeDiffCalc(Number(pendingRequest.date));
	console.log('Pending request time: ', pendingRequest, timediff);
	if(timediff.minutes >= 60) {
		await UserAccountOwnershipRequest.expireRequest(pendingRequest.id);
		return true;
	} else {
		return false;
	}
}

getAccountTransaction = async () => {
	let lastBlock = await LastScanBlock.getLast();
	if(!!lastBlock) {
		lastBlock = lastBlock.block_number;
	} else {
		lastBlock = 0;
	}

	return Request({
    uri: `${KEYS.ETHERSCAN_API_URL}/api?module=account&action=txlist&address=${KEYS.ADDRESS_FOR_ACCOUNT_VERIFICATION}&startblock=${lastBlock}&endblock=99999999&sort=asc&apikey=${KEYS.ETHERSCAN_API_KEY}`,
    "json": true
  });
}

scanAddressTransactions = async (pendingRequests) => {
	const response = await getAccountTransaction();
	console.log('verifyPendingRequests: scanAddressTransactions: ', response.result.length);
	if (response.result.length > 0) {
		for(let i = 0; i < pendingRequests.length; i++) {
			let pendingRequest = pendingRequests[i];
			const fltTxn = response.result.find(txn =>
				(txn.from.toLowerCase() === pendingRequest.ethAddress.toLowerCase()) &&
				(Number(txn.value) >= (KEYS.AMOUNT_FOR_ACCOUNT_VERIFICATION * Math.pow(10, 16))));
			console.log(`scanAddressTransactions: ${pendingRequest.ethAddress}`, fltTxn);
			if(!!fltTxn) {
				console.log(`scanAddressTransactions: transaction found for ${pendingRequest.ethAddress}`);
				const user = await User.findByMobileOrEmail(pendingRequest.email, pendingRequest.mobile, pendingRequest.countryCode);
				console.log(user);

				if (!!user) {
					await updateExistingUser(user, pendingRequest, fltTxn.hash);
				} else {
					await createNewUser(pendingRequest, fltTxn.hash)
				}
			} else {
				console.log(`scanAddressTransactions: no transaction found for ${pendingRequest.ethAddress}`);
			}
		}

		await updateLastBlock(response.result[response.result.length - 1]);
	} else {
		console.log(`scanAddressTransactions: no transactions found`)
	}
}

updateExistingUser = async (user, pendingRequest, txnHash) => {
	const member = await Member.findByEthAddress(pendingRequest.ethAddress);

	if (!!member) {
		await associateUser(member.id, user.id, pendingRequest.id, txnHash);
	}
}

associateUser = (memberId, userId, pendingRequestId, txnHash) => {
	Member.updateMemberForUser(memberId, userId).then(async (result) => {
		await UserAccountOwnershipRequest.updateStatus(pendingRequestId, txnHash, 'approved', userId, memberId);
		console.log('scanAddressTransactions: user successfully updated for pending request:', pendingRequest);
	});
}

createNewUser = async(pendingRequest, txnHash) => {
	const member = await Member.findByEthAddress(pendingRequest.ethAddress);
	if (!!member) {
		User.create(pendingRequest.email, pendingRequest.mobile, pendingRequest.countryCode).then(async (result) => {
			await associateUser(member.id, result.id, pendingRequest.id, txnHash);
		});
	}
}

updateLastBlock = async(lastTxn) => {
	let lastBlock = await LastScanBlock.getLast();
	if(!!lastBlock) {
		await LastScanBlock.updateBlock(lastTxn.blockNumber);
	} else {
		new LastScanBlock.createBlock({block_number: lastTxn.blockNumber}).save();
	}
}

verifyPendingRequests();