const opencollective_graphql_url = "https://api.opencollective.com/graphql/v2";
const graphql_query =
    `
        query fetchContributors($account_type: [AccountType]!, $profile_image_height: Int!){
          account(slug: "kivy") {
            name
            slug
            members(role: BACKER, accountType: $account_type, limit:1000) {
              nodes {
                account {
                  id
                  slug
                  name
                  imageUrl(height:$profile_image_height, format: jpg)
                }
                tier {
                  name
                }
                totalDonations {
                  value
                  currency
                }
              }
            }
          }
        }
    `;

function filter_duplicated_profiles(arr) {
    return arr.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.account.id === value.account.id
        ))
    )
}

async function fetch_contributors(account_type, profile_image_height) {
    return await axios({
        url: opencollective_graphql_url,
        method: 'post',
        data: {
            operationName: "fetchContributors",
            query: graphql_query,
            variables: {
                account_type: account_type,
                profile_image_height: profile_image_height
            }
        }
    }).then((response) => {
        let members = filter_duplicated_profiles(response.data.data.account.members.nodes);
        members.sort((firstItem, secondItem) => firstItem.totalDonations.value - secondItem.totalDonations.value);
        members.reverse();
        return members.filter(member => member.totalDonations.value > 0);
    });
}


const { createApp } = Vue;
var opencollective_app = createApp({
    el: '#opencollective_app',
    data() {
        return {
            organizations: [],
            individuals: []
        };
    },
    computed: {
    },
    async mounted() {
        this.organizations = await fetch_contributors("ORGANIZATION", 256);
        this.individuals = await fetch_contributors("INDIVIDUAL", 32);
    }
}).mount("#opencollective_app");
