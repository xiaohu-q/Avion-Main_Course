
// model for the banking application
class BankingApp {

    static users = new Array()
    static currentUser = null;
    static initialPage = document.querySelector('#view_initial')
    static loggedInPage = document.querySelector('#view_loggedin')
    static displayName = document.querySelector('#user_name').childNodes[0]
    static displayAvatar = document.getElementById('user_avatar')
    static displayAccCrt = document.querySelector('#user_accountcreation')
    static displayAccNum = document.querySelector('#user_accountnumber').childNodes[2]
    static displayBalance = document.querySelector('#user_balance').childNodes[2]
    static changeAvatarBtn = document.getElementById('user_accountAvatarChange')
    static transactionsList = document.getElementById('transactions_list')
    static transactionSelect = document.getElementById('transaction_type')
    static form_register = document.getElementById('form_register')
    static form_login = document.getElementById('form_login')
    static form_deposit = document.getElementById('form_deposit')
    static form_withdraw = document.getElementById('form_withdraw')
    static form_send = document.getElementById('form_send')

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

        this.displayName.textContent = foundUser.fullname
        this.displayAccCrt.textContent = `Member since: ${foundUser.accountCreation}`
        this.displayAccNum.textContent = ` ${foundUser.accountNumber}`
        this.displayBalance.textContent = foundUser.balance
        this.displayAvatar.setAttribute('src', foundUser.avatar)
        this.currentUser = foundUser
        this.showInitialPage(false);
        resetForms()
    }

    static logout = () => {
        this.currentUser = null
        this.showInitialPage(true)
        resetForms()
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
        const newTransaction = new Transact(
            'DEPOSIT', accountNumber, foundUser.balance, parseInt(amount)
        )
        foundUser.balance += parseInt(amount)
        foundUser.transactions.unshift(newTransaction)
        this.displayBalance.textContent = foundUser.balance
    }

    static withdraw = (accountNumber, amount) => {
        const foundUser = this.findUser(accountNumber)
        const newTransaction = new Transact(
            'WITHDRAW', accountNumber, foundUser.balance, amount
        )
        foundUser.balance -= parseInt(amount);
        foundUser.transactions.unshift(newTransaction)
        this.displayBalance.textContent = foundUser.balance
    }

    static send = (fromAccount, toAccount, amount) => {
        const from = this.findUser(fromAccount)
        const to = this.findUser(toAccount)
        const newTransactionFrom = new TransactSend(
            from.accountNumber, from.balance, amount, to.accountNumber, 'TO'
        )
        const newTransactionTo = new TransactSend(
            from.accountNumber, to.balance, amount, to.accountNumber, 'FROM'
        )
        from.balance -= parseInt(amount);
        from.transactions.unshift(newTransactionFrom)
        to.balance += parseInt(amount);
        to.transactions.unshift(newTransactionTo)
        this.displayBalance.textContent = from.balance
    }

    static getBalance = () => {
        return this.currentUser.balance;
    }

    static getAllTransactions = type => {
        const transactions = new Array();

        type === 'ALL'
            ? transactions.push(...this.currentUser.transactions)
            : transactions.push(...this.currentUser.transactions.filter(t => t.type === type))

        return transactions;
    }

    static submitRegisterForm = event => {
        event.preventDefault();
        const formData = new FormData(this.form_register);
        const { reg_fullname, reg_password, reg_password_confirm } = parseFormData(formData);

        if (reg_password !== reg_password_confirm) return null;

        this.createUser(reg_fullname, reg_password)
        this.login(reg_fullname, reg_password)
        resetForms()
    }

    static submitLoginForm = event => {
        event.preventDefault();
        const formData = new FormData(this.form_login);
        const { log_fullname, log_password } = parseFormData(formData);
        this.login(log_fullname, log_password)
        resetForms()
    }

    static submitDepositForm = event => {
        event.preventDefault();
        const formData = new FormData(this.form_deposit);
        const { deposit_amount } = parseFormData(formData);
        this.deposit(this.currentUser.accountNumber, parseInt(deposit_amount))
        resetForms()
    }

    static submitWithdrawForm = event => {
        event.preventDefault();
        const formData = new FormData(this.form_withdraw);
        const { withdraw_amount } = parseFormData(formData);
        this.withdraw(this.currentUser.accountNumber, parseInt(withdraw_amount))
        resetForms()
    }

    static submitSendForm = event => {
        event.preventDefault();
        const formData = new FormData(form_send);
        const { receiver_accnum, send_amount } = parseFormData(formData);
        BankingApp.send(BankingApp.currentUser.accountNumber, receiver_accnum, parseInt(send_amount))
        resetForms()
    }

    static changeAvatar = event => {
        const blob = URL.createObjectURL(event.target.files[0])
        this.currentUser.avatar = blob;
        this.displayAvatar.setAttribute('src', blob);
    }

    static changeTransactionType = event => {
        const transactions = BankingApp.getAllTransactions(event.target.value)

        this.transactionsList.innerHTML = ''; // removes all child nodes

        if (transactions.length === 0) {
            const div = document.createElement("DIV")
            const img = document.createElement("IMG")
            const msg = document.createElement("H3")
            div.classList.add('transactions_list_empty')
            img.setAttribute('src', '/assets/images/empty.svg')
            msg.textContent = `No results found for the query`
            div.appendChild(msg)
            div.appendChild(img)
            this.transactionsList.appendChild(div)
            return null;
        }

        transactions.forEach(transaction => {
            const li = document.createElement("LI");
            const spanDate = document.createElement("SPAN");
            const spanBalanceBefore = document.createElement("SPAN");
            const mainContentType = document.createElement("SPAN");
            const mainContentAmount = document.createElement("SPAN");
            const mainContent = document.createElement("P");
            li.classList.add('transactions_listitem');
            spanDate.classList.add('transactions_listitem_date')
            spanDate.textContent = transaction.transactionDate
            spanBalanceBefore.classList.add('transactions_listitem_balanceBefore')
            spanBalanceBefore.textContent = `Balance before this transaction: ${transaction.balanceBefore}`
            mainContent.classList.add('transactions_listitem_main')
            mainContentType.classList.add('transactions_listitem_type')
            mainContentAmount.classList.add('transactions_listitem_amount')
            mainContentType.textContent = transaction.type == 'SENT TO' ||
                transaction.type == 'SENT FROM'
                ? `${transaction.type} ${transaction.sentToOrFromAccountNumber}`
                : transaction.type
            mainContentAmount.textContent = transaction.amount
            mainContent.appendChild(mainContentType)
            mainContent.appendChild(mainContentAmount)
            li.appendChild(spanDate)
            li.appendChild(spanBalanceBefore)
            li.appendChild(mainContent)
            this.transactionsList.appendChild(li)
        })
    }
}








// ====================================================== //
// EVENT LISTENERS
// ====================================================== //

const transactionsBtn = document.getElementById('transactions');
const initNavItemsArr = [...document.querySelector('.initial_nav_parent').children];
const initNavViewsArr = [...document.querySelector('.view_initial_nav_dynamic').children];
const userActionsViewsArr = [...document.querySelector('.view_useractions').children];
const userActionsBtnsArr = [...document.querySelector('.user_actions').children, transactionsBtn];


// dynamic initial page panels for each nav buttons
initNavItemsArr.forEach(navItem => {
    navItem.addEventListener('click', function () {
        resetForms();

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

// dynamic user panels for each action buttons except logout
userActionsBtnsArr.forEach(actionBtn => {
    actionBtn.addEventListener('click', function () {
        resetForms();

        if (this.dataset.action) {

            userActionsViewsArr.forEach(view => {
                view.dataset.action === actionBtn.dataset.action
                    ? view.style.display = 'flex'
                    : view.style.display = 'none'
            });

            userActionsBtnsArr.forEach(actionBtn2 => {
                if (actionBtn2.dataset.action &&
                    actionBtn2.dataset.action !== 'transactions') {
                    this.dataset.action === actionBtn2.dataset.action
                        ? this.classList.add('active-nav')
                        : actionBtn2.classList.remove('active-nav')
                }
            })

            return null;
        }

        BankingApp.logout();
    })
})


// onsubmission of register form
BankingApp.form_register.addEventListener('submit', BankingApp.submitRegisterForm)

// onsubmission of login form
BankingApp.form_login.addEventListener('submit', BankingApp.submitLoginForm)

// onsubmission fo deposit form
BankingApp.form_deposit.addEventListener('submit', BankingApp.submitDepositForm)

// onsubmission fo withdraw form
BankingApp.form_withdraw.addEventListener('submit', BankingApp.submitWithdrawForm)

// onsubmission of send money form
BankingApp.form_send.addEventListener('submit', BankingApp.submitSendForm)

// onchange of file to change the avatar
BankingApp.changeAvatarBtn.addEventListener('change', BankingApp.changeAvatar)

// onchange of transaction type select options
BankingApp.transactionSelect.addEventListener('change', BankingApp.changeTransactionType)





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

function resetForms() {
    BankingApp.form_register.reset();
    BankingApp.form_login.reset();
    BankingApp.form_deposit.reset();
    BankingApp.form_withdraw.reset();
    BankingApp.form_send.reset();
    BankingApp.changeAvatarBtn.value = '';
    BankingApp.transactionSelect.value = 'All';
    BankingApp.transactionsList.innerHTML = '';
}










// ====================================================== //
// MODELS
// ====================================================== //
// model for each user
function BankingAppUser(fullname, password) {
    this.accountCreation = new Date().toDateString();
    this.accountNumber = Math.random().toString().substr(2, 10);
    this.fullname = fullname;
    this.password = password;
    this.balance = 0;
    this.transactions = new Array();
    this.avatar = `/assets/images/default.jpg`;
}

function Transact(type, accountNumber, before, amount) {
    this.type = type // 'DEPOSIT' or 'WITHDRAW'
    this.transactionDate = new Date().toDateString();
    this.accountNumber = accountNumber;
    this.balanceBefore = before
    this.amount = amount
}

// model for send transaction
function TransactSend(accountNumber, before, amount, toAccountNumber, direction) {
    this.type = `SENT ${direction}`
    this.transactionDate = new Date().toDateString();
    this.accountNumber = accountNumber;
    this.balanceBefore = before
    this.amount = amount
    this.sentToOrFromAccountNumber = toAccountNumber
}