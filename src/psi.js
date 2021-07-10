import axios from 'axios';

const endpoint = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const run = async (queryString) => {
    return await axios.get(`${endpoint}?${queryString}`);
};

export default {
    run,
};
