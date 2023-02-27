import { LightningElement, track} from 'lwc';

import getExpenses from '@salesforce/apex/ExpenseController.getExpenses';

export default class Lwc_ExpenseList extends LightningElement {

    @track isLoading = true;
    @track expenseList = [];

    @track searchTerm;
  
    search(event) {
      this.searchTerm = event.detail.value.trim().toLowerCase();
    }
  
    renderedcallback(){
        this.getExpenses();
        
        this.isLoading = false;

    }

    connectedCallback(){
        this.getExpenses();
        
        this.isLoading = false;
    }

    @track expenseList = [];
    getExpenses(){
        getExpenses().then(data => {
            if (data) {
                let expenseList = [];
                for (const d of data) {
                    expenseList.push({
                        "Tittle":d.Tittle__c,
                        LinkTittle: "/" + d.Id,
                        "Category":d.Category__c,
                        "Date":d.Expense_Date__c,
                        "Amount":d.Amount__c,
                        "Id": d.Id,
                        "Weekly":d.Weekly__c,
                        "Monthly":d.Monthly__c
                    });
                }
                this.expenseList = expenseList;
                console.log('00000000', JSON.stringify(this.expenseList));
                if (this.expenseList.length < 3) {
                    this.expenseListDivStyle = "";
                }    
                this.error = false;
            }});
        }

    get expenseItems() {
      const { searchTerm } = this;
  
        return this.expenseList.filter((v) => {
            return  searchTerm == null ||
                    searchTerm.length == 0 ||
                    v.Tittle.toLowerCase().indexOf(searchTerm) !== -1;
        });
    }
  
    @track columns = [{
        label: 'Expense', fieldName: 'LinkTittle', type: 'url', sortable: true, 
            typeAttributes:{ label:{ fieldName:"Tittle"}, target:"_blank"}
        },{
        label: 'Category', fieldName: 'Category', type: 'textl', sortable: true, 
            typeAttributes:{ label:{ fieldName:"Category" }}
        },{
        label: 'Amount', fieldName: 'Amount',type: 'currency', sortable: true, 
            typeAttributes:{currencyCode: 'ARS'}
        },{
        label: 'Date', fieldName: 'Date', type: 'date', initialWidth: 100, sortable: true,
            cellAttributes: { class: { fieldName: 'Date' }}
        },{
        label: 'Weekly', fieldName: 'Weekly', type: 'boolean', initialWidth: 100, 
            cellAttributes: { class: { fieldName: 'Weekly' }}
        },{
        label: 'Monthly', fieldName: 'Monthly', type: 'boolean', initialWidth: 100,
            cellAttributes: { class: { fieldName: 'Monthly' }}
        }];

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.expenseList];

        let col = { type:"string" };
        for (const c of this.columns) {
            if(c.fieldName == sortedBy){
                col = c;
                break;
            }
        }

        let primer = null;
        if(["currency","number","integer", "decimal"].includes(col.type.toLowerCase())){
            primer = function name(x) {
                return parseFloat(x[sortedBy]);
            }
        }
        else if(["url"].includes(col.type.toLowerCase())){
            let labelField = col.fieldName;
            if (col.typeAttributes && col.typeAttributes.label && col.typeAttributes.label.fieldName) {
                labelField = col.typeAttributes.label.fieldName;
            }
            primer = function(x){
                return x[labelField];
            }
        }

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1, primer));
        this.expenseList = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

    sortBy(field, reverse, primer) {
        const key = primer
            ? function(x) {
                    return primer(x);
                }
            : function(x) {
                    return x[field];
                };

        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }
}