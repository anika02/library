public with sharing class UserController {
    @AuraEnabled(Cacheable=true)
    public static User getCurrentUserInfo() {
        return UserSelector.selector.getUserInfo(UserInfo.getUserId());
    }

    @AuraEnabled(Cacheable=true)
    public static BookOwner getUserInfoById(Id userId) {
        return new BookOwner(UserSelector.selector.getUserInfo(userId));
    }

    public class BookOwner {
        @AuraEnabled public Id id { get; set; }
        @AuraEnabled public String city { get; set; }
        @AuraEnabled public String country { get; set; }
        @AuraEnabled public String name { get; set; }
        @AuraEnabled public List<Map<String, String>> contacts = new List<Map<String, String>>();

        public BookOwner(User u) {
            this.id = u.Id;
            this.city = u.City;
            this.country = u.Country;
            this.name = u.Name;

            List<DescribeFieldResult> fieldsList = new List<DescribeFieldResult>{
                User.Email.getDescribe(),
                User.Instagram__c.getDescribe(),
                User.Phone.getDescribe(),
                User.Telegram_Phone__c.getDescribe(),
                User.Telegram_Username__c.getDescribe(),
                User.Viber__c.getDescribe()
            };

            for (DescribeFieldResult field : fieldsList) {
                if (u.get(field.name) != null) {
                    this.contacts.add(new Map<String, String> {
                        'label' => field.label,
                        'value' => (String) u.get(field.name)
                    });
                }
            }
        }
    }
}