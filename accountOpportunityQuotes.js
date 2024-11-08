import { LightningElement, api, wire } from 'lwc';
import fetchAccountOpportunitiesWithQuotes from '@salesforce/apex/AccountDataFetcher.fetchAccountOpportunitiesWithQuotes';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AccountOpportunityQuotes extends LightningElement {
    @api recordId;
    data;

    @wire(fetchAccountOpportunitiesWithQuotes, { accountId: '$recordId' })
    wiredOpportunities({ error, data }) {
        if (data) {
            try {
                this.data = JSON.parse(data);
            } catch (parseError) {
                // Handle JSON parsing error
                this.showToast('Error', 'Failed to process data from the server.', 'error');
                console.error('JSON Parse Error:', parseError);
            }
        } else if (error) {
            // Handle server error
            this.showToast('Error', 'Failed to fetch opportunities and quotes.', 'error');
            console.error('Server Error:', error);
        }
    }

    // Helper function to show toast messages
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}