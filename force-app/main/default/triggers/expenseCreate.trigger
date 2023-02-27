trigger expenseCreate on Expense__c (after insert) {

    if(Trigger.isAfter){
        if(Trigger.isInsert){
            helperExpenseTrigger.createAnualExpense(Trigger.new);
        }
      } 
}