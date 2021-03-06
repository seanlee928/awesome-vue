var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello world',
        gridColumns: [{
            name: 'customerId',
            isKey: true
        }, {
            name: 'companyName'
        }, {
            name: 'contactName'
        }, {
            name: 'phone'
        }],
        gridData: [],
        apiUrl: 'http://211.149.193.19:8080/api/customers',
        item: {},
        show: false
    },
    ready: function() {
        this.getCustomers();
    },
    methods: {
        getCustomers: function() {
            this.$http.get(this.apiUrl)
                .then((response) => {
                    this.$set('gridData', response.data)
                })
                .catch(function(response) {
                    console.log(response);
                });
        },
        close: function() {
            console.log(1);
            this.show = false;
        },
        saveCustomer: function() {
            this.item.customerId ? this.updateCustomer() : this.createCustomer();
            this.show = false;
        },
        updateCustomer: function() {
            var vm = this;

            vm.$http.put(this.apiUrl + '/' + vm.item.customerId, vm.item)
                .then((response) => {
                    vm.getCustomers();
                })
        },
        createCustomer: function() {
            var vm = this;
            vm.$http.post(vm.apiUrl, vm.item)
                .then((response) => {
                    vm.$set('item', {});
                    vm.getCustomers();
                });
            this.show = false;
        },
        loadCustomer: function(customerId) {
            var vm = this;
            vm.gridData.forEach(function(item) {
                if (item.customerId === customerId) {
                    vm.$set('item', item);
                    return;
                }
            });
            vm.$set('show', true);
        },
        deleteCustomer: function(customer) {
            var vm = this;
            vm.$http.delete(this.apiUrl + '/' + customer.customerId)
                .then((response) => {
                    vm.getCustomers();
                })
        }
    },
    components: {
        'grid': {
            template: '#grid-template',
            props: ['dataList', 'columns'],
            methods: {
                loadEntry: function(key) {
                    this.$dispatch('load-entry', key);
                },
                deleteEntry: function(entry) {
                    this.$dispatch('delete-entry', entry);
                }
            }
        },
        'dialog': {
            template: '#dialog-template',
            props: ['show'],
            methods: {

            }
        }
    }
});

app.$watch('show', function(newVal, oldVal) {
    if (!newVal) {
        this.item = {};
    }
})
