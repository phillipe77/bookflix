const API_BASE = 'http://localhost:5000/api/books'; // Este é o endereço onde seu backend está rodando

const basicFetch = async(endpoint) => {
    const req = await fetch(`${API_BASE}${endpoint}`);
    const json = await req.json();
    return json;
}

// Criação do objeto 'bookApi' e exportação
const bookApi = {
    getHomeList: async() => { 
        return [
            {
                slug: 'all',
                title: 'Todos os Livros',
                items: await basicFetch('/')
            },
            {
                slug: 'commentaries',
                title: 'Comentários Bíblicos',
                items: await basicFetch('/?category=Comentário Bíblico')
            },
            // Adicione outras categorias conforme necessário
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
