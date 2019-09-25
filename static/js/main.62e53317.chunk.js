(window.webpackJsonpmultitool=window.webpackJsonpmultitool||[]).push([[0],{121:function(e,t){},184:function(e,t,n){e.exports=n(398)},186:function(e,t,n){},199:function(e,t){},206:function(e,t){},208:function(e,t){},257:function(e,t){},398:function(e,t,n){"use strict";n.r(t);n(185),n(186);var r=n(0),a=n.n(r),i=n(70),s=n.n(i),o=n(16),c=n(71),u=n(180),l=n(31),m=n(32),h=n(34),p=n(33),f=n(35),d=n(10),g=n(18),b=n(2),v=n(94),E=n.n(v),y=n(27),k=n.n(y),w=n(11),x=n.n(w),S=n(41),O=n.n(S),I=n(19),j=n.n(I),q=function(e){var t=e.error;return a.a.createElement(k.a,{variant:"danger",hidden:!t},t)},C=new Map([["local-iov-devnet",{id:"local-iov-devnet",tokenTicker:"CASH",fee:{quantity:"100000000",fractionalDigits:9,tokenTicker:"CASH"},nodeUrl:"ws://localhost:23456/",networkType:"testnet",recipientPrefix:"tiov"}],["iov-boarnet",{id:"iov-boarnet",tokenTicker:"IOV",fee:{quantity:"100000000",fractionalDigits:9,tokenTicker:"IOV"},nodeUrl:"wss://rpc.boarnet.iov.one",networkType:"testnet",recipientPrefix:"tiov"}],["iov-babynet",{id:"iov-babynet",tokenTicker:"IOV",fee:{quantity:"500000000",fractionalDigits:9,tokenTicker:"IOV"},nodeUrl:"wss://rpc-private-a-vip-babynet.iov.one",networkType:"testnet",recipientPrefix:"tiov"}],["iov-mainnet",{id:"iov-mainnet",tokenTicker:"IOV",fee:{quantity:"500000000",fractionalDigits:9,tokenTicker:"IOV"},nodeUrl:"wss://rpc-private-a.iov.one",networkType:"mainnet",recipientPrefix:"iov"}]]);var T=function(e){var t=e.transaction;return a.a.createElement("pre",null,function(e){var t="string"===typeof e?JSON.parse(e):e;return JSON.stringify(t,null,2)}(b.TransactionEncoder.toJson(t)))};function N(e){var t=e.quantity,n=e.fractionalDigits,r=e.tokenTicker;return"".concat(b.Decimal.fromAtomics(t,n).toString()," ").concat(r)}var M=n(1),P=n.n(M),A=n(12);function F(e){return D.apply(this,arguments)}function D(){return(D=Object(A.a)(P.a.mark((function e(t){var n,r;return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=C.get(t)){e.next=3;break}throw new Error("Chain not found");case 3:return r=Object(g.createBnsConnector)(n.nodeUrl,t),e.abrupt("return",r);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function U(e,t){return L.apply(this,arguments)}function L(){return(L=Object(A.a)(P.a.mark((function e(t,n){var r,a,i;return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F(t);case 2:return r=e.sent,e.next=5,r.establishConnection();case 5:return a=e.sent,e.next=8,a.getNonce({pubkey:n});case 8:return i=e.sent,a.disconnect(),e.abrupt("return",i);case 11:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function J(){return(J=Object(A.a)(P.a.mark((function e(t,n){var r,a,i,s;return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=Object(g.multisignatureIdToAddress)(t,Uint8Array.from(b.Uint64.fromNumber(n).toBytesBigEndian())),e.next=3,F(t);case 3:return a=e.sent,e.next=6,a.establishConnection();case 6:return i=e.sent,e.next=9,i.getAccount({address:r});case 9:return s=e.sent,i.disconnect(),e.abrupt("return",{address:r,balance:s?s.balance:void 0});case 12:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function R(){return(R=Object(A.a)(P.a.mark((function e(t){var n,r,a,i;return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F(t.transaction.creator.chainId);case 2:return n=e.sent,e.next=5,n.establishConnection();case 5:return r=e.sent,e.next=8,r.postTx(g.bnsCodec.bytesToPost(t));case 8:return a=e.sent,e.next=11,a.blockInfo.waitFor((function(e){return!Object(d.isBlockInfoPending)(e)}));case 11:if(i=e.sent,!Object(d.isBlockInfoPending)(i)){e.next=14;break}throw new Error("Block info still pending. This is a bug");case 14:if(!Object(d.isBlockInfoFailed)(i)){e.next=16;break}throw new Error("Error posting transaction: ".concat(i.message));case 16:return e.abrupt("return",a.transactionId);case 17:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function B(e){return e instanceof Error?e.message:"".concat(e)}var H=n(46),V=n(96),Q=n.n(V),W=0;function _(e){return z.apply(this,arguments)}function z(){return(z=Object(A.a)(P.a.mark((function e(t){var n,r,a,i,s;return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Q.a.create(1e3);case 2:return n=e.sent,e.prev=3,r=new H.IovLedgerApp(n),e.next=7,r.getVersion();case 7:if(a=e.sent,Object(H.isIovLedgerAppVersion)(a)){e.next=10;break}throw new Error(a.errorMessage);case 10:if(i=a.testMode?"testnet":"mainnet",t===i){e.next=13;break}throw new Error("Pubkey for ".concat(t," required but got response from the ").concat(i," app"));case 13:return e.next=15,r.getAddress(W);case 15:if(s=e.sent,Object(H.isIovLedgerAppAddress)(s)){e.next=18;break}throw new Error(s.errorMessage);case 18:return e.abrupt("return",{pubkey:s.pubkey});case 19:return e.prev=19,e.next=22,n.close();case 22:return e.finish(19);case 23:case"end":return e.stop()}}),e,null,[[3,,19,23]])})))).apply(this,arguments)}function Z(e,t){return G.apply(this,arguments)}function G(){return(G=Object(A.a)(P.a.mark((function e(t,n){var r,a,i,s,o,c,u,l,m;return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,U(n.chainId,n.pubkey);case 2:return r=e.sent,a=g.bnsCodec.bytesToSign(t,r),i=a.bytes,s="iov-mainnet"===n.chainId?"mainnet":"testnet",e.next=7,Q.a.create(5e3);case 7:return o=e.sent,e.prev=8,c=new H.IovLedgerApp(o),e.next=12,c.getVersion();case 12:if(u=e.sent,Object(H.isIovLedgerAppVersion)(u)){e.next=15;break}throw new Error(u.errorMessage);case 15:if(l=u.testMode?"testnet":"mainnet",s===l){e.next=18;break}throw new Error("Pubkey for ".concat(s," required but got response from the ").concat(l," app"));case 18:return e.next=20,c.sign(W,i);case 20:if(m=e.sent,Object(H.isIovLedgerAppSignature)(m)){e.next=23;break}throw new Error(m.errorMessage);case 23:return e.abrupt("return",{pubkey:n.pubkey,nonce:r,signature:m.signature});case 24:return e.prev=24,e.next=27,o.close();case 27:return e.finish(24);case 28:case"end":return e.stop()}}),e,null,[[8,,24,28]])})))).apply(this,arguments)}function Y(){return(Y=Object(A.a)(P.a.mark((function e(t){var n;return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Z(t,t.creator);case 2:return n=e.sent,e.abrupt("return",{transaction:t,primarySignature:n,otherSignatures:[]});case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function K(e){return b.Encoding.toBase64(e).replace("+","-").replace("/","_")}function X(e){return b.Encoding.fromBase64(e.replace("-","+").replace("_","/"))}var $=n(49),ee=n(30);function te(e,t){return e.length===t.length&&e.every((function(e,n){return e===t[n]}))}var ne=4;function re(e){return new ee.Sha256(e).digest().slice(0,ne)}function ae(e,t){var n=t(e),r=n.slice(0,ne),a=n.slice(ne);if(!te(r,re(a)))throw new Error("Checksum mismatch");return a}function ie(e){if(!Object(b.isNonNullObject)(e))return!1;var t=e;return!!Object(d.isUnsignedTransaction)(t)&&(!!Object(d.isSendTransaction)(t)&&!!Object(g.isMultisignatureTx)(t))}function se(e){return JSON.stringify(b.TransactionEncoder.toJson(e))}function oe(e){var t=b.TransactionEncoder.fromJson(JSON.parse(e));if(!Object(d.isFullSignature)(t))throw new Error("Invalid signature format");return t}function ce(e,t){return ue.apply(this,arguments)}function ue(){return(ue=Object(A.a)(P.a.mark((function e(t,n){var r,a,i,s,o;return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=g.bnsCodec.bytesToSign(t,n.nonce),a=r.bytes,i=r.prehashType,e.t0=i,e.next=e.t0===d.PrehashType.Sha512?4:9;break;case 4:return s=new ee.Sha512(a).digest(),e.next=7,ee.Ed25519.verifySignature(n.signature,s,n.pubkey.data);case 7:return o=e.sent,e.abrupt("return",o);case 9:throw new Error("Unexpected prehash type");case 10:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var le=b.Encoding.fromUtf8,me=b.Encoding.toUtf8;function he(e){return function(e,t){var n=re(e);return t(new Uint8Array([].concat(Object($.a)(n),Object($.a)(e))))}(me(function(e){return JSON.stringify(b.TransactionEncoder.toJson(e))}(e)),K)}function pe(e){var t=ae(e,X),n=b.TransactionEncoder.fromJson(JSON.parse(le(t)));if(!function(e){if(!Object(b.isNonNullObject)(e))return!1;var t=e,n=t.transaction,r=t.primarySignature,a=t.otherSignatures;return!!ie(n)&&(!!Object(d.isFullSignature)(r)&&!(!Array.isArray(a)||a.some((function(e){return!Object(d.isFullSignature)(e)}))))}(n))throw new Error("Transaction data is not an SignedTransaction<SendTransaction & MultisignatureTx & WithCreator>");return n}function fe(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=he(e),r=t?window.location.href.split("#")[0]+"#":"";return"".concat(r,"/sign/").concat(n)}function de(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}var ge={creatorHex:"",chainId:"iov-boarnet",formMultisigContractId:"21",formRecipient:"tiov1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqplsnxjl",formQuantity:"100.56",formMemo:"What a wonderful day",encodingError:null,signing:!1},be=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(h.a)(this,Object(p.a)(t).call(this,e))).state=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?de(n,!0).forEach((function(t){Object(u.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):de(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},ge),n}return Object(f.a)(t,e),Object(m.a)(t,[{key:"componentDidUpdate",value:function(){var e=this,t=null;try{var n=C.get(this.state.chainId);if(!n)throw new Error("No configuration for theis chain ID found");this.state.lastQueriedMultisigContractId!==this.state.formMultisigContractId&&(this.setState({lastQueriedMultisigContractId:this.state.formMultisigContractId,contractInfo:void 0}),function(e,t){return J.apply(this,arguments)}(n.id,b.Uint64.fromString(this.state.formMultisigContractId).toNumber()).then((function(t){var n=t.address,r=t.balance;e.setState({contractInfo:{address:n,balance:r}})})).catch((function(e){return console.error(e)})));var r=b.Uint64.fromString(this.state.formMultisigContractId),a=Object(g.multisignatureIdToAddress)(this.state.chainId,Uint8Array.from(r.toBytesBigEndian()));if(!this.state.creatorHex)throw new Error("Transaction creator unset");if(!this.state.formRecipient.startsWith(n.recipientPrefix))throw new Error("Recipient address with prefix '".concat(n.recipientPrefix,"' expected"));var i={kind:"bcp/send",creator:{chainId:this.state.chainId,pubkey:{algo:d.Algorithm.Ed25519,data:b.Encoding.fromHex(this.state.creatorHex)}},amount:{quantity:b.Decimal.fromUserInput(this.state.formQuantity,9).atomics,fractionalDigits:9,tokenTicker:n.tokenTicker},sender:a,recipient:this.state.formRecipient,memo:this.state.formMemo,fee:{tokens:n.fee},multisig:[r.toNumber()]};g.bnsCodec.bytesToSign(i,0),E()(this.state.unsignedTransaction,i)||this.setState({unsignedTransaction:i,encodingError:null})}catch(s){t=B(s)}this.state.encodingError!==t&&this.setState({unsignedTransaction:void 0,encodingError:t})}},{key:"render",value:function(){var e=this;return a.a.createElement(O.a,null,this.state.statusUrl&&a.a.createElement(o.a,{to:this.state.statusUrl,push:!0}),a.a.createElement(j.a,null,a.a.createElement(x.a,{className:"col-6"},a.a.createElement("h3",null,"Enter transaction"),a.a.createElement("form",null,a.a.createElement("div",{className:"form-group"},a.a.createElement("label",{htmlFor:"chainIdInput"},"Chain ID"),a.a.createElement("select",{className:"form-control",id:"chainIdInput",value:this.state.chainId,onChange:function(t){return e.handleFormChange("chainId",t)}},Array.from(C.keys()).map((function(e){return a.a.createElement("option",null,e)})))),a.a.createElement("div",{className:"form-group"},a.a.createElement("label",{htmlFor:"creatorInput"},"Transaction creator"),a.a.createElement("button",{className:"btn btn-link btn-sm",onClick:function(t){t.preventDefault(),e.reloadCreatorFromLedger()}},"Get from Ledger"),a.a.createElement("button",{className:"btn btn-link btn-sm",onClick:function(t){t.preventDefault(),e.clearCreator()}},"Clear"),a.a.createElement("input",{id:"creatorInput",className:"form-control",type:"text",placeholder:"Creator pubkey ",value:this.state.creatorHex,disabled:!0}),a.a.createElement("small",{className:"form-text text-muted"},"Pubkey of the person who creates this transaction")),a.a.createElement(q,{error:this.state.getPubkeyError}),a.a.createElement("div",{className:"form-group"},a.a.createElement("label",{htmlFor:"senderInput"},"Multisig contract ID"),a.a.createElement("input",{id:"senderInput",className:"form-control",type:"text",placeholder:"Sender",value:this.state.formMultisigContractId,onChange:function(t){return e.handleFormChange("multisigContractId",t)}}),a.a.createElement("small",{className:"form-text text-muted"},"Use integer format, e.g. 42"),a.a.createElement("div",{className:"invalid-feedback"},"Please choose a username.")),a.a.createElement("div",{className:"form-group"},a.a.createElement("label",{htmlFor:"recipientInput"},"Recipient address"),a.a.createElement("input",{id:"recipientInput",className:"form-control",type:"text",placeholder:"Recipient",value:this.state.formRecipient,onChange:function(t){return e.handleFormChange("recipient",t)}}),a.a.createElement("small",{id:"emailHelp",className:"form-text text-muted"},"IOV address, e.g. iov1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqp396zjw")),a.a.createElement("div",{className:"form-group"},a.a.createElement("label",{htmlFor:"quantityInput"},"Quantity"),a.a.createElement("input",{id:"quantityInput",className:"form-control",type:"text",placeholder:"100.56",value:this.state.formQuantity,onChange:function(t){return e.handleFormChange("quantity",t)}}),a.a.createElement("small",{className:"form-text text-muted"},"Quantity, e.g. 100.56 for 100.56 IOV")),a.a.createElement("div",{className:"form-group"},a.a.createElement("label",{htmlFor:"memoInput"},"Memo"),a.a.createElement("input",{id:"memoInput",className:"form-control",type:"text",placeholder:"Memo",value:this.state.formMemo,onChange:function(t){return e.handleFormChange("memo",t)}}),a.a.createElement("small",{id:"emailHelp",className:"form-text text-muted"},"Arbitrary text attached to the transaction")),a.a.createElement("p",null,a.a.createElement("button",{type:"submit",className:"btn btn-primary",disabled:this.state.signing||!this.state.unsignedTransaction,onClick:function(t){t.preventDefault(),e.signAndContinue()}},"Sign and continue")),a.a.createElement(k.a,{hidden:!this.state.signing,variant:"info"},"Please sign transaction using Ledger device now"),a.a.createElement(q,{error:this.state.signingError}))),a.a.createElement(x.a,{className:"col-6"},a.a.createElement("h3",null,"Multisig contract info"),this.state.contractInfo&&a.a.createElement("p",null,"Address: ",this.state.contractInfo.address,a.a.createElement("br",null),"Balance:"," ",this.state.contractInfo.balance?this.state.contractInfo.balance.map(N).join(", "):"\u2013"),a.a.createElement("h3",null,"Details"),this.state.unsignedTransaction&&a.a.createElement("div",null,a.a.createElement("p",null,"This is a machine processable representation of the transaction."),a.a.createElement(T,{transaction:this.state.unsignedTransaction})),a.a.createElement(k.a,{variant:"danger",hidden:!this.state.encodingError},a.a.createElement("p",{className:"mb-0"},a.a.createElement("strong",null,"Transaction encoding error:"),a.a.createElement("br",null),this.state.encodingError)))))}},{key:"handleFormChange",value:function(e,t){var n=t.target.value;switch(e){case"chainId":this.setState({chainId:n});break;case"multisigContractId":this.setState({formMultisigContractId:n});break;case"recipient":this.setState({formRecipient:n});break;case"quantity":this.setState({formQuantity:n});break;case"memo":this.setState({formMemo:n});break;default:throw new Error("Unsupported form field '".concat(e,"'"))}}},{key:"clearCreator",value:function(){this.setState({creatorHex:"",getPubkeyError:void 0})}},{key:"reloadCreatorFromLedger",value:function(){var e=this;this.clearCreator();var t=C.get(this.state.chainId);if(!t)throw new Error("Chain not found");_(t.networkType).then((function(t){var n=b.Encoding.toHex(t.pubkey);console.log("Received pubkey from Ledger:",n),e.setState({creatorHex:n})}),(function(t){console.info("Full error message",t),e.setState({getPubkeyError:B(t)})}))}},{key:"signAndContinue",value:function(){var e=this;if(this.setState({signingError:void 0,signing:!0}),!this.state.unsignedTransaction)throw new Error("unsigned transaction not set");(function(e){return Y.apply(this,arguments)})(this.state.unsignedTransaction).then((function(t){var n=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=he(e),r=t?window.location.href.split("#")[0]+"#":"";return"".concat(r,"/status/").concat(n)}(t);console.log("Navigating to",n),e.setState({statusUrl:n,signing:!1})}),(function(t){console.info("Full error message",t),e.setState({signingError:B(t),signing:!1})}))}}]),t}(a.a.Component),ve=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(h.a)(this,Object(p.a)(t).call(this,e))).state={transaction:null,localSignature:"",signing:!1},n}return Object(f.a)(t,e),Object(m.a)(t,[{key:"componentDidMount",value:function(){if(!this.state.transaction){var e=window.location.href.match(/\/sign\/([-_=a-zA-Z0-9]+)/);if(e&&e.length>=2)try{var t=function(e){var t=ae(e,X),n=b.TransactionEncoder.fromJson(JSON.parse(le(t)));if(!ie(n))throw new Error("Transaction data is not an SendTransaction & MultisignatureTx & WithCreator");return n}(e[1]);this.setState({transaction:t})}catch(n){console.warn("Full error message",n),this.setState({globalError:"Error in URL: "+B(n)})}else this.setState({globalError:"Error in URL: Transaction missing"})}}},{key:"render",value:function(){var e=this;return a.a.createElement(O.a,null,a.a.createElement(j.a,null,a.a.createElement(x.a,null,a.a.createElement(q,{error:this.state.globalError}))),a.a.createElement(j.a,null,a.a.createElement(x.a,{className:"col-6"},a.a.createElement("h2",null,"Review transaction"),this.state.transaction&&a.a.createElement(T,{transaction:this.state.transaction})),a.a.createElement(x.a,{className:"col-6"},a.a.createElement("h2",null,"Create Signature"),a.a.createElement("div",{className:"form-group"},a.a.createElement("label",{htmlFor:"yourSignature"},"Your signature"),a.a.createElement("textarea",{className:"form-control",id:"yourSignature",rows:6,value:this.state.localSignature,readOnly:!0})),a.a.createElement("p",null,a.a.createElement("button",{className:"btn btn-primary",onClick:function(){var t=Object(A.a)(P.a.mark((function t(n){var r,a;return P.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n.preventDefault(),e.setState({localSignature:"",signingError:void 0,signing:!0}),t.prev=2,t.next=5,e.createSignature();case 5:r=t.sent,e.setState({localSignature:r,signing:!1}),t.next=14;break;case 9:t.prev=9,t.t0=t.catch(2),console.info("Full error message",t.t0),a=B(t.t0),e.setState({signingError:a,signing:!1});case 14:case"end":return t.stop()}}),t,null,[[2,9]])})));return function(e){return t.apply(this,arguments)}}()},"Sign transaction now")),a.a.createElement(k.a,{hidden:!this.state.signing,variant:"info"},"Please sign transaction using Ledger device now"),a.a.createElement(q,{error:this.state.signingError}))),a.a.createElement(j.a,null,a.a.createElement(x.a,null,"\xa0")))}},{key:"createSignature",value:function(){var e=Object(A.a)(P.a.mark((function e(){var t,n,r,a,i;return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=this.state.transaction){e.next=3;break}throw new Error("Transaction not set");case 3:if(n=C.get(t.creator.chainId)){e.next=6;break}throw new Error("Chain not found");case 6:return e.next=8,_(n.networkType);case 8:return r=e.sent,a={chainId:t.creator.chainId,pubkey:{algo:d.Algorithm.Ed25519,data:r.pubkey}},e.next=12,Z(t,a);case 12:return i=e.sent,e.abrupt("return",se(i));case 14:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()}]),t}(a.a.Component),Ee=function(e){function t(){return Object(l.a)(this,t),Object(h.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(f.a)(t,e),Object(m.a)(t,[{key:"render",value:function(){return a.a.createElement(O.a,null,a.a.createElement(j.a,null,a.a.createElement(x.a,null,a.a.createElement("h1",null,"Multitool"),a.a.createElement("h2",null,"Create multisignatures transactions using Ledger Nano S"))),a.a.createElement(j.a,null,a.a.createElement(x.a,{className:""}),a.a.createElement(x.a,{className:"col-4"},a.a.createElement(c.b,{to:"/create",className:"btn btn-lg btn-block btn-primary"},"Create new transaction")),a.a.createElement(x.a,{className:""}),a.a.createElement(x.a,{className:"col-4"},"\xa0"),a.a.createElement(x.a,{className:""})))}}]),t}(a.a.Component);var ye=b.Encoding.toHex,ke=function(e){var t=e.index,n=e.chainId,r=e.signature,i=e.noneStatus,s=g.bnsCodec.identityToAddress({chainId:n,pubkey:r.pubkey});return a.a.createElement("li",{className:"list-group-item last-child-no-bottom-margin",key:ye(r.pubkey.data)},a.a.createElement("h5",null,"#".concat(t+1)," ",function(e,t){if(e.length<=t)return e;var n=Math.ceil((t-"\u2026".length)/2),r=Math.floor((t-"\u2026".length)/2);return e.slice(0,n)+"\u2026"+e.slice(-r)}(s,22)),a.a.createElement("p",{className:"text-muted text-break"},se(r)),i&&i.error&&a.a.createElement(k.a,{variant:"warning"},"Nonce outdated. In signature: ",i.error.received,"; Expected: ",i.error.expected))},we=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(h.a)(this,Object(p.a)(t).call(this,e))).interval=void 0,n.state={nonceStatuses:e.signatures.map((function(e){return{}}))},n}return Object(f.a)(t,e),Object(m.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=function(){var t=Object(A.a)(P.a.mark((function t(){var n;return P.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,Promise.all(e.props.signatures.map(function(){var t=Object(A.a)(P.a.mark((function t(n){var r;return P.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,U(e.props.chainId,n.pubkey);case 2:if(r=t.sent,n.nonce!==r){t.next=7;break}return t.abrupt("return",{});case 7:return t.abrupt("return",{error:{expected:r,received:n.nonce}});case 8:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()));case 3:n=t.sent,e.setState({nonceStatuses:n}),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),console.warn(t.t0);case 10:case"end":return t.stop()}}),t,null,[[0,7]])})));return function(){return t.apply(this,arguments)}}();setTimeout(t,300),this.interval=setInterval(t,7e3)}},{key:"componentWillUnmount",value:function(){this.interval&&clearTimeout(this.interval),this.interval=void 0}},{key:"render",value:function(){var e=this;return a.a.createElement("ol",{className:"list-group mb-3"},this.props.signatures.map((function(t,n){return a.a.createElement(ke,{key:ye(t.signature),index:n,chainId:e.props.chainId,signature:t,noneStatus:e.state.nonceStatuses[n]})})))}}]),t}(a.a.Component),xe=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(h.a)(this,Object(p.a)(t).call(this,e))).state={transaction:null,signatures:[],localSignature:"",posting:!1},n}return Object(f.a)(t,e),Object(m.a)(t,[{key:"componentDidMount",value:function(){if(!this.state.transaction){var e=window.location.href.match(/\/status\/([-_=a-zA-Z0-9]+)/);if(e&&e.length>=2)try{var t=pe(e[1]),n=t.transaction,r=t.primarySignature,a=t.otherSignatures;this.setState({transaction:n,signatures:[r].concat(Object($.a)(a))})}catch(i){console.warn("Full error message",i),this.setState({globalError:"Error in URL: "+B(i)})}else this.setState({globalError:"Error in URL: Transaction missing"})}}},{key:"render",value:function(){var e=this;return a.a.createElement(O.a,null,a.a.createElement(j.a,null,a.a.createElement(x.a,null,a.a.createElement(q,{error:this.state.globalError}))),a.a.createElement(j.a,null,a.a.createElement(x.a,null,a.a.createElement("h2",null,"Signing link"),a.a.createElement("div",{className:"form-group"},a.a.createElement("label",{htmlFor:"signingLink"},"Send this link to every user supposed to sign this transaction"),a.a.createElement("input",{className:"form-control",id:"signingLink",value:this.state.transaction?fe(this.state.transaction,!0):"",readOnly:!0})))),a.a.createElement(j.a,null,a.a.createElement(x.a,{className:"col-6"},a.a.createElement("h2",null,"Review transaction"),this.state.transaction&&a.a.createElement(T,{transaction:this.state.transaction})),a.a.createElement(x.a,{className:"col-6"},a.a.createElement("h2",null,"Signatures"),this.state.transaction&&a.a.createElement(we,{chainId:this.state.transaction.creator.chainId,signatures:this.state.signatures}),a.a.createElement("p",null,a.a.createElement("button",{className:"btn btn-primary btn-sm",onClick:function(t){t.preventDefault(),e.addSignature()}},"Add signature")),a.a.createElement(q,{error:this.state.addSignatureError}),a.a.createElement("h2",null,"Post to blockchain"),a.a.createElement("div",{hidden:!!this.state.postSuccess},a.a.createElement("p",null,"The transaction with all signatures from above will be posted to the IOV blockchain."),a.a.createElement("p",null,a.a.createElement("button",{className:"btn btn-primary",disabled:this.state.posting,onClick:function(t){t.preventDefault(),e.postToChain()}},"Post now"))),a.a.createElement(k.a,{variant:"success",hidden:!this.state.postSuccess},a.a.createElement("p",null,"Sucessfully posted transaction with ID ",this.state.postSuccess," to the blockchain.")),a.a.createElement(q,{error:this.state.postError}))),a.a.createElement(j.a,null,a.a.createElement(x.a,null,"\xa0")))}},{key:"addSignature",value:function(){var e=Object(A.a)(P.a.mark((function e(){var t,n,r;return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.state.transaction){e.next=2;break}throw new Error("Original transaction not set");case 2:if(this.setState({addSignatureError:void 0}),null!==(t=prompt("Please enter signature"))){e.next=6;break}return e.abrupt("return");case 6:return e.prev=6,n=oe(t),e.next=10,ce(this.state.transaction,n);case 10:if(e.sent){e.next=12;break}throw new Error("Signature is not valid for this transaction");case 12:if(!this.state.signatures.map((function(e){return e.signature})).find((function(e){return te(e,n.signature)}))){e.next=15;break}throw new Error("This signature is already included");case 15:r=this.state.signatures.filter((function(e){return!te(e.pubkey.data,n.pubkey.data)})),this.setState({signatures:[].concat(Object($.a)(r),[n])}),e.next=23;break;case 19:e.prev=19,e.t0=e.catch(6),console.info("Full error message",e.t0),this.setState({addSignatureError:B(e.t0)});case 23:case"end":return e.stop()}}),e,this,[[6,19]])})));return function(){return e.apply(this,arguments)}}()},{key:"postToChain",value:function(){var e=this;if(!this.state.transaction)throw new Error("Original transaction not set");var t=function(e,t){var n=t.find((function(){return!0}));if(!n)throw new Error("First signature missing");return{transaction:e,primarySignature:n,otherSignatures:t.slice(1)}}(this.state.transaction,this.state.signatures);this.setState({posting:!0,postError:void 0}),function(e){return R.apply(this,arguments)}(t).then((function(t){console.log("Successfully posted",t),e.setState({posting:!1,postError:void 0,postSuccess:t})}),(function(t){console.info("Full error message",t),e.setState({posting:!1,postError:B(t)})}))}}]),t}(a.a.Component);s.a.render(a.a.createElement(c.a,null,a.a.createElement(o.d,null,a.a.createElement(o.b,{exact:!0,path:"/create",component:be}),a.a.createElement(o.b,{path:"/status",component:xe}),a.a.createElement(o.b,{path:"/sign",component:ve}),a.a.createElement(o.b,{path:"/",component:Ee}))),document.getElementById("root"))}},[[184,1,2]]]);
//# sourceMappingURL=main.62e53317.chunk.js.map