/*
** EPITECH PROJECT, 2025
** tests
** File description:
** sheetHandling
*/

const { google } = require('googleapis');

class SheetSync {
    constructor(credentials, spreadsheetId) {
        this.spreadsheetId = spreadsheetId;
        this.auth = this._setupAuth(credentials);
        this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    }

    _setupAuth(credentials) {
        const { client_email, private_key } = credentials;
        const auth = new google.auth.JWT(
            client_email,
            null,
            private_key,
            ['https://www.googleapis.com/auth/spreadsheets']
        );
        return auth;
    }

    async readSheet(range) {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: range,
            });
            return response.data.values || [];
        } catch (error) {
            console.error('Error reading from sheet:', error);
            throw error;
        }
    }

    async writeToSheet(range, values) {
        try {
            const response = await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.spreadsheetId,
                range: range,
                valueInputOption: 'USER_ENTERED',
                resource: { values: values },
            });
            console.log(`${response.data.updatedCells} cells updated.`);
            return response;
        } catch (error) {
            console.error('Error writing to sheet:', error);
            throw error;
        }
    }

    async syncData(listOfLists, range) {
        await this.writeToSheet(range, listOfLists);

        const updatedData = await this.readSheet(range);
        return updatedData;
    }
}

module.exports = SheetSync;
