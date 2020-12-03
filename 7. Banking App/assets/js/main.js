// model for each user
class BankingAppUser {
    constructor(fullname, password) {
        this.accountCreation = new Date();
        this.accountNumber = Math.random().toString().substr(2, 10);
        this.fullname = fullname;
        this.password = password;
        this.balance = 0;
        this.transactions = new Array();
    }
}

// model for deposit transaction
class TransactDeposit {
    constructor(accountNumber, before, amount) {
        this.type = 'DEPOSIT'
        this.transactionDate = new Date().toLocaleString();
        this.accountNumber = accountNumber;
        this.balanceBeforeDeposit = before
        this.depositAmount = amount
    }
}

// model for withdraw transaction
class TransactWithdraw {
    constructor(accountNumber, before, amount) {
        this.type = 'WITHDRAW'
        this.transactionDate = new Date().toLocaleString();
        this.accountNumber = accountNumber;
        this.balanceBeforeWithdraw = before
        this.withdrawAmount = amount
    }
}

// model for send transaction
class TransactSend {
    constructor(accountNumber, before, amount, toAccountNumber, direction) {
        this.type = `SEND ${direction}`
        this.transactionDate = new Date().toLocaleString();
        this.accountNumber = accountNumber;
        this.balanceBeforeSend = before
        this.sentAmount = amount
        this.sentToAccountNumber = toAccountNumber
    }
}

// model for the banking application
class BankingApp {

    static users = new Array()
    static currentUser = null;
    static initialPage = document.querySelector('#view_initial')
    static loggedInPage = document.querySelector('#view_loggedin')

    static findUser = accountNumber => {
        return this.users.find(user => user.accountNumber === accountNumber)
    }

    static login = (fullname, password) => {
        const foundUser = this.users.find(user => {
            return user.fullname === fullname &&
                user.password === password
        })

        if (!foundUser) {
            alert("User does'nt exists")
            return null;
        }

        this.currentUser = foundUser
        this.showInitialPage(false);
    }

    static logout = () => {
        this.currentUser = null
        this.showInitialPage(true)
    };

    static showInitialPage = toShowInitPage => {
        this.initialPage.style.display = toShowInitPage ? 'flex' : 'none';
        this.loggedInPage.style.display = toShowInitPage ? 'none' : 'flex';
    }

    static createUser = (fullname, password) => {
        const newUser = new BankingAppUser(fullname, password);
        this.users.push(newUser);
    }

    static deposit = (accountNumber, amount) => {
        const foundUser = this.findUser(accountNumber)
        const newTransaction = new TransactDeposit(
            accountNumber, foundUser.balance, parseInt(amount)
        )
        foundUser.balance += parseInt(amount)
        foundUser.transactions.unshift(newTransaction)
    }

    static withdraw = (accountNumber, amount) => {
        const foundUser = this.findUser(accountNumber)
        const newTransaction = new TransactWithdraw(
            accountNumber, foundUser.balance, amount
        )
        foundUser.balance -= parseInt(amount);
        foundUser.transactions.unshift(newTransaction)
    }

    static send = (fromAccount, toAccount, amount) => {
        const from = this.findUser(fromAccount)
        const to = this.findUser(toAccount)
        const newTransactionFrom = new TransactSend(
            from.fullname, from.balance, amount, to.fullname, 'FROM'
        )
        const newTransactionTo = new TransactSend(
            from.fullname, to.balance, amount, to.fullname, 'TO'
        )
        from.balance -= parseInt(amount);
        from.transactions.unshift(newTransactionFrom)
        to.balance += parseInt(amount);
        to.transactions.unshift(newTransactionTo)
    }

    static getBalance = () => {
        return this.currentUser.balance;
    }

    static getAllTransactions = (type = 'ALL') => {
        return type === 'ALL'
            ? this.currentUser.transactions
            : this.currentUser.transactions.map(t => t.type === type)
    }

}








const form_register = document.querySelector('#form_register')
const form_login = document.querySelector('#form_login')
const initNavItemsArr = [...document.querySelector('.initial_nav_parent').children];
const initNavViewsArr = [...document.querySelector('.view_initial_nav_dynamic').children];

// dynamic panels for each nav buttons
initNavItemsArr.forEach(navItem => {
    navItem.addEventListener('click', function () {

        initNavViewsArr.forEach(view => {
            navItem.dataset.view === view.dataset.view
                ? view.style.display = 'flex'
                : view.style.display = 'none'
        })

        initNavItemsArr.forEach(navItem => {
            this.dataset.view === navItem.dataset.view
                ? this.classList.add('active-nav')
                : navItem.classList.remove('active-nav')
        })

    })
})

// onsubmission of register form
form_register.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form_register);
    const formDataParsed = parseFormData(formData);
    const { reg_fullname, reg_password, reg_password_confirm } = formDataParsed;

    if (reg_password !== reg_password_confirm) return null;

    BankingApp.createUser(reg_fullname, reg_password)
    BankingApp.login(reg_fullname, reg_password)
    form_register.reset();

})

// onsubmission of login form
form_login.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form_login);
    const formDataParsed = parseFormData(formData);
    const { log_fullname, log_password } = formDataParsed;

    BankingApp.login(log_fullname, log_password)
    form_login.reset();
})























// ====================================================== //
// HELPER FUNCTIONS 
// ====================================================== //
function parseFormData(formData) {
    const formdataParsed = {};

    [...formData].forEach(formitem => {
        formdataParsed[formitem[0]] = formitem[1]
    });

    return formdataParsed;
}