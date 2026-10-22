/* Key-term glossary: underlines important terms on the page; tap one for a plain-English definition.
   No API key, works offline. Definitions live in this file. */
(function(){
if(window.__wajoGloss)return;window.__wajoGloss=true;
var TERMS=[
["SOX","The Sarbanes-Oxley Act, a 2002 US law passed after accounting scandals like Enron. It requires public companies to keep strong internal controls over financial reporting, makes executives personally certify the numbers, and created the PCAOB to police auditors."],
["GAAP","Generally Accepted Accounting Principles: the standard rulebook US companies follow when preparing financial statements, set by FASB and enforced by the SEC."],
["IFRS","International Financial Reporting Standards: the global accounting rulebook used in most countries outside the US. More principles-based where GAAP is more rules-based."],
["FASB","The Financial Accounting Standards Board, the private body that writes US GAAP."],
["SEC","The Securities and Exchange Commission, the US government regulator for public companies, markets, and disclosures."],
["PCAOB","The Public Company Accounting Oversight Board, created by SOX to inspect and discipline audit firms that audit public companies."],
["10-K","A public company's annual report filed with the SEC: audited financial statements, footnotes, risk factors, and management's discussion."],
["10-Q","A public company's quarterly SEC report: unaudited (reviewed) financial statements with updates since the 10-K."],
["Audit","An independent examination of a company's financial statements. Auditors gather evidence, test controls and balances, and give an opinion on whether the statements are fairly presented."],
["Internal controls","The processes a company builds so its numbers are reliable and its assets are safe: approvals, reconciliations, access limits, segregation of duties. SOX requires management to certify they work."],
["Materiality","The size at which an error or omission would change a reader's decision. Small misses that would not sway anyone are immaterial and can be left alone."],
["Accrual accounting","Recording revenue when earned and expenses when incurred, not when cash moves. It matches income and costs to the period they belong to."],
["Revenue recognition","The rules for when revenue counts as earned: generally when control of the goods or service passes to the customer at the agreed price."],
["Depreciation","Spreading the cost of a long-lived physical asset (a truck, a machine) over the years it helps earn revenue. A non-cash expense."],
["Amortization","Like depreciation, but for intangible assets such as patents or software, or for spreading loan costs over time."],
["Deferred revenue","Money collected before the work is done, like an annual subscription paid upfront. It sits as a liability until it is earned."],
["Goodwill","The premium paid above the fair value of a company's net assets in an acquisition, mostly for reputation, brand, and people. Tested yearly for impairment."],
["Impairment","A write-down when an asset's value on the books is no longer recoverable, often goodwill after a deal disappoints."],
["Fair value","The price an asset would fetch in an orderly sale between willing parties, used to re-measure many assets under GAAP and IFRS."],
["FIFO","First In, First Out inventory costing: the oldest goods are assumed sold first. In inflation it leaves newer, higher costs in inventory and shows higher profit than LIFO."],
["LIFO","Last In, First Out inventory costing: the newest goods are assumed sold first. In inflation it shows higher costs, lower profit, lower taxes. Not allowed under IFRS."],
["COGS","Cost of Goods Sold: the direct cost of producing what was sold, materials and direct labor. Revenue minus COGS is gross profit."],
["Gross margin","Gross profit as a percent of revenue: (revenue minus COGS) divided by revenue. It shows how much is left to cover overhead and profit."],
["EBITDA","Earnings Before Interest, Taxes, Depreciation and Amortization: operating profit before financing and accounting charges. A common proxy for cash operating profit."],
["EBIT","Earnings Before Interest and Taxes: operating profit after depreciation and amortization but before financing costs and taxes."],
["Operating margin","Operating profit (EBIT) as a percent of revenue: how much of each sales dollar is left after running the business."],
["Net margin","Net income as a percent of revenue: the bottom-line profit left after every cost, interest, and tax."],
["Fixed costs","Costs that do not move with volume: rent, salaries, insurance. They make leverage cut both ways."],
["Variable costs","Costs that rise and fall with each unit sold: materials, shipping, sales commissions."],
["Contribution margin","Price minus variable cost, per unit or in total: what each sale adds toward covering fixed costs and then profit."],
["Break-even","The volume where contribution margin exactly covers fixed costs: no profit, no loss. Volume = fixed costs / contribution margin per unit."],
["CAGR","Compound Annual Growth Rate: the smoothed yearly growth rate between two points in time. (End / Start)^(1/years) minus 1."],
["Working capital","Current assets minus current liabilities: the cushion needed to run day to day. Negative working capital can be efficient, not just risky."],
["Cash conversion cycle","Days inventory sits, plus days receivables take to collect, minus days you can stretch payables. Shorter is better: cash comes back faster."],
["Current ratio","Current assets divided by current liabilities: can short-term assets cover debts due within a year. Under 1 can signal a squeeze."],
["Quick ratio","Like the current ratio but excluding inventory, which may be hard to sell quickly. A stricter liquidity test."],
["Leverage","Using debt to finance the business or a deal. It magnifies returns when things go well and losses when they do not."],
["Interest coverage","EBIT divided by interest expense: how many times over operating profit could pay the interest bill. Below about 2x is a warning sign."],
["Balance sheet","The snapshot of what a company owns (assets), owes (liabilities), and what shareholders have left (equity) at one date. Assets = liabilities + equity."],
["Income statement","The period scorecard: revenue, then costs, down to net income. Also called the P&L."],
["Cash flow statement","The statement tracking actual cash in and out across operations, investing, and financing. Cash is harder to dress up than profit."],
["Trial balance","The list of every ledger account and its balance, pulled before statements are prepared. Debits must equal credits."],
["Reconciliation","Proving two records agree: the bank statement against the cash ledger, a subsidiary ledger against the control account, then fixing what does not."],
["Walkthrough","An audit step where you trace one real transaction end to end to confirm you understand the process and its controls."],
["Substantive testing","Audit tests of the numbers themselves: vouching transactions to documents, confirming balances with banks or customers, recomputing figures."],
["Tie-out","Checking that a number agrees across documents: the schedule to the trial balance, the statement to the ledger, the workpaper to the report."],
["Vouching","Picking entries in the books and tracing back to source documents to prove they really happened. Tests existence, not completeness."],
["Going concern","The assumption that a company can keep operating for the foreseeable future. Substantial doubt about it changes the audit opinion and the reporting."],
["Restatement","Re-issuing previously filed financial statements to fix material errors. A red flag for controls and for trust."],
["Control deficiency","A gap in internal controls. A significant deficiency is worth reporting; a material weakness means controls may not catch a material misstatement."],
["Segment reporting","Public companies must break out revenue and results by business line or geography so readers can see where the money is made."],
["NPV","Net Present Value: the value today of a project's future cash flows, discounted at the cost of capital, minus the upfront cost. Positive NPV creates value."],
["IRR","Internal Rate of Return: the discount rate that makes a project's NPV exactly zero, i.e. the project's implied yearly return. Beat the hurdle rate and it passes."],
["Payback period","How long cumulative cash inflows take to return the initial investment. Simple, but ignores time value and anything after payback."],
["WACC","Weighted Average Cost of Capital: the blended required return of a company's debt and equity holders. The discount rate for valuing the whole firm."],
["Discount rate","The rate used to convert future cash flows into today's value. A higher rate means a lower present value: it prices risk and time."],
["DCF","Discounted Cash Flow valuation: forecast free cash flows, discount them at WACC, add a terminal value, and you have enterprise value."],
["Terminal value","The value of all cash flows beyond the forecast window, usually grown at a modest rate or based on an exit multiple. Often most of a DCF's value."],
["Enterprise value","The value of the whole business: market cap plus net debt. What a buyer effectively pays for the operations, independent of financing."],
["Market cap","Share price times shares outstanding: what the equity of a public company is worth in the market."],
["Trading comps","Valuing a company against the multiples (like EV/EBITDA) of similar public companies. Fast and market-based, but only as good as the peer set."],
["Precedent transactions","Valuing a company against multiples paid in past acquisitions of similar businesses. Captures control premiums; data can be stale."],
["LBO","Leveraged Buyout: buying a company mostly with debt, improving it, and repaying debt from cash flow. Private equity firms live here; returns come from debt paydown and multiple expansion."],
["Synergies","Extra value created by combining two companies: cost savings from overlapping functions or revenue gains from cross-selling. Aggressive synergy assumptions kill deals."],
["Due diligence","The deep pre-deal investigation of a target's financials, legal exposure, customers, and operations, to confirm what you are actually buying."],
["Term sheet","A mostly non-binding summary of a deal's key terms: price, structure, conditions, timeline. Signed before the definitive agreements."],
["Dilution","Existing owners' percentage shrinking when new shares are issued, through an offering, options, or convertibles."],
["IPO","Initial Public Offering: a private company sells shares to the public for the first time, gaining access to capital and liquidity at the cost of regulation and scrutiny."],
["M&A","Mergers and Acquisitions: buying, selling, or combining companies. Accretive deals raise the buyer's earnings per share; dilutive ones lower it."],
["Accretion","In an acquisition, whether the buyer's earnings per share goes up (accretive) or down (dilutive). A quick screen on whether a deal is worth it, not the whole answer."],
["Churn","The share of customers or revenue lost in a period. High churn means the business is leaking faster than it can fill."],
["ARR","Annual Recurring Revenue: the normalized run-rate of subscription revenue (MRR is the monthly version). Investors value recurring dollars above one-off sales."],
["Market share","A company's sales as a percent of its total market. Rising share with flat margins can still mean a price war."],
["Penetration","How deeply a product has reached its potential customers. Low penetration can justify growth spending; high penetration suggests the market is saturating."],
["Sensitivity analysis","Re-running a model with one input changed (price down 10%, churn up 5%) to see how the answer moves. Shows which assumptions actually matter."],
["Vertical integration","Owning more steps of your supply chain, upstream (suppliers) or downstream (distribution, retail). More control, more capital, more risk."],
["Economies of scale","Unit costs falling as volume rises: fixed costs spread over more units and purchasing power grows. A common moat in case interviews."],
["Moat","A durable advantage that keeps competitors from eroding profits: brand, network effects, switching costs, scale, patents."],
["Stakeholder","Anyone affected by a decision: customers, employees, investors, suppliers, regulators. Good case answers weigh the trade-offs across them."],
["NAV","Net Asset Value: assets minus liabilities, often used for funds or asset-heavy businesses where the balance sheet says more than earnings."],
["Hurdle rate","The minimum return an investment must clear to be worth doing, usually the cost of capital plus a margin for risk."],
["Free cash flow","Operating cash flow minus capital spending: the cash the business actually generates that could go to debt holders and shareholders."],
["Run rate","Extrapolating a period's results to a full period (monthly revenue times 12). Useful for early trends, risky if the period was unusual."],
["Cannibalization","When a new product eats the sales of an existing one. Growth that looks great in isolation can be a wash overall."]
];
var N_EACH=2;
var css=document.createElement('style');
css.textContent=['.gl{border-bottom:1.5px dotted currentColor;cursor:pointer}',
'.gl.on{background:rgba(13,107,97,.14)}',
'#gl-pop{position:fixed;z-index:99999;max-width:340px;width:max-content;background:#13202a;color:#e5ecef;border-radius:10px;padding:12px 14px;box-shadow:0 10px 30px rgba(0,0,0,.4);font:13.5px/1.5 -apple-system,system-ui,sans-serif;display:none}',
'#gl-pop b{display:block;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:#4cc2b1;margin-bottom:4px}'].join('');
document.head.appendChild(css);
var pop=document.createElement('div');pop.id='gl-pop';document.body.appendChild(pop);
var cur=null;
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function show(el){
 if(cur)cur.classList.remove('on');
 cur=el;el.classList.add('on');
 var d=el.__def;
 pop.innerHTML='<b>'+esc(d[0])+'</b>'+esc(d[1]);
 pop.style.display='block';
 pop.style.top='';pop.style.bottom='';
 var r=el.getBoundingClientRect();
 var pw=Math.min(340,window.innerWidth-24);
 var left=Math.max(12,Math.min(r.left+r.width/2-pw/2,window.innerWidth-pw-12));
 pop.style.left=left+'px';
 pop.style.setProperty('--ax',(r.left+r.width/2-left)+'px');
 if(r.top>190){pop.style.bottom=(window.innerHeight-r.top+8)+'px';}
 else{pop.style.top=(r.bottom+8)+'px';}
}
function hide(){if(cur)cur.classList.remove('on');cur=null;pop.style.display='none';}
document.addEventListener('click',function(e){
 var g=e.target&&e.target.closest?e.target.closest('.gl'):null;
 if(g){e.preventDefault();e.stopPropagation();show(g);}else hide();
},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape')hide();});
function SKIP(n){
 var p=n.parentNode;
 if(!p||!p.closest)return true;
 return !!p.closest('script,style,.gl,#gl-pop,button,select,input,textarea,.tts-bar,#chat-panel,#chat-fab,.chat-msg,.cb-wrap');
}
var counts={};
function tryNode(node){
 var txt=node.nodeValue;
 if(!txt||txt.length<3)return false;
 for(var k=0;k<TERMS.length;k++){
  var t=TERMS[k];
  if((counts[t[0]]||0)>=N_EACH)continue;
  var re=new RegExp('\\b'+t[0].replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s+')+'\\b','i');
  var mm=re.exec(txt);
  if(!mm)continue;
  counts[t[0]]=(counts[t[0]]||0)+1;
  var i=mm.index,j=mm.index+mm[0].length;
  var frag=document.createDocumentFragment();
  frag.appendChild(document.createTextNode(txt.slice(0,i)));
  var sp=document.createElement('span');sp.className='gl';sp.textContent=txt.slice(i,j);sp.__def=t;
  frag.appendChild(sp);
  frag.appendChild(document.createTextNode(txt.slice(j)));
  node.parentNode.replaceChild(frag,node);
  return true;
 }
 return false;
}
function main(){
 var root=document.querySelector('main')||document.body;
 var guard=0,progress=true;
 while(progress&&guard++<800){
  progress=false;
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
   return (SKIP(n)||!n.nodeValue.trim())?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;}});
  var n;
  while(n=w.nextNode()){
   if(tryNode(n)){progress=true;break;}
  }
 }
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',main);}else{main();}
})();
