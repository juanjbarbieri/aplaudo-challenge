import { LightningElement, track,wire} from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import category from '@salesforce/schema/Expense__c.Category__c';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import EXPENSE_OBJECT from '@salesforce/schema/Expense__c';

import createExpense from '@salesforce/apex/ExpenseController.createExpense';

export default class Lwc_ExpenseCreator extends LightningElement {

    @wire(getObjectInfo, { objectApiName: EXPENSE_OBJECT })
    categoryInfo;

    @wire(getPicklistValues,
        {
            recordTypeId: '$categoryInfo.data.defaultRecordTypeId',
            fieldApiName: category
        }
    )
    _expenseCategoryValues;

    @track error;

    @track expenseObject = {};

    get expenseCategoryValues(){
        return this._expenseCategoryValues;
    }

    cleanFields(){
        console.log(' this.template ', this.template);
        this.template.querySelectorAll('lightning-input').forEach((v) => {
            if (v.type == 'checkbox' || v.type == 'checkbox-button') {
                v.checked = false;
            } else {
                v.value = null;
            }
        })
        this.template.querySelectorAll('lightning-combobox').forEach((v) => {
            v.value = null;
        })           
    }

    handleTittleChange(event) {
        this.expenseObject.Tittle__c = event.target.value;
    }
    
    handleCategoryChange(event) {
        this.expenseObject.Category__c = event.target.value;
    }

    handleDateChange(event) {
        this.expenseObject.Expense_Date__c = event.target.value;
    }

    handleAmountChange(event) {
        this.expenseObject.Amount__c = event.target.value;
    }

    handleWeeklyChange(event) {
        this.expenseObject = {
            ...this.expenseObject,
            Monthly__c: false,
            Weekly__c: event.target.checked,
        }
    }

    handleMonthlyChange(event) {
        this.expenseObject = {
            ...this.expenseObject,
            Weekly__c: false,
            Monthly__c: event.target.checked,
        }
    }

    handleClick() {
        createExpense({expense:this.expenseObject})
        .then(result => {
            this.expenseObject = {};
            const toastEvent = new ShowToastEvent({
                title:'Success!',
                message:'Expense is created Successfully!',
                variant:'success'
            });
            this.dispatchEvent(toastEvent);
            this.cleanFields();
        })
        .catch(e =>{
            console.log(e.body.message);
            const toastEvent = new ShowToastEvent({
                title:'Error!',
                message:e.body.message,
                variant:'error'
            });
            this.dispatchEvent(toastEvent);
        })
    }
}