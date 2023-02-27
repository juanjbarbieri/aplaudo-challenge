import { LightningElement, track } from 'lwc';

import getExpenses from '@salesforce/apex/ExpenseController.getExpenses';

export default class Lwc_Expenses extends LightningElement {

    handelTabChange(event){
        const value = event.target;

       // console.log('handelTabChange @@@', value);

    }
}