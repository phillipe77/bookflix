const API_BASE = 'https://back-bookflix.vercel.app/api/books';

const basicFetch = async(endpoint) => {
    const req = await fetch(`${API_BASE}${endpoint}`);
    if (!req.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${req.statusText}`);
    }
    const json = await req.json();
    return json;
}

const bookApi = {
    getHomeList: async() => { 
        return [
            {
                slug: 'commentaries',
                title: 'Comentários Bíblicos',
                items: await basicFetch('/?category=Comentário Bíblico')
            },
            {
                slug: 'theology',
                title: 'Teologia',
                items: await basicFetch('/?category=Teologia')
            },
            {
                slug: 'missions',
                title: 'Missões',
                items: await basicFetch('/?category=Missões')
            },
            {
                slug: 'discipleship',
                title: 'Discipulado',
                items: await basicFetch('/?category=Discipulado')
            },
            {
                slug: 'prayer',
                title: 'Oração',
                items: await basicFetch('/?category=Oração')
            },
            {
                slug: 'worship',
                title: 'Adoração',
                items: await basicFetch('/?category=Adoração')
            },
            {
                slug: 'sermon',
                title: 'Sermão',
                items: await basicFetch('/?category=Sermão')
            },
            
            {
                slug: 'Crucial Questions',
                title: 'Questões Cruciais',
                items: await basicFetch('/?category=Questões Cruciais')
            },
            
           
        ];
    },
    getBookInfo: async(bookId) => { 
        let info = {};

        if(bookId) {
            info = await basicFetch(`/${bookId}`);
        }
        
        return info;
    }
}

export default bookApi;
