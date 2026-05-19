export interface Evento {
    id?: string;
    title: string;
    organizacao?: string;
    content: string;
    createdAt: Date | any;
    updatedAt?: Date | any;
    imageUrl: string; // Make sure this is required if you're using it
    eventoUrl?: string; // Make sure this is required if you're using it

}

export interface EventoDestaque {
    id?: string;
    title: string;
    organizacao?: string;
    content: string;
    createdAt: Date | any;
    updatedAt?: Date | any;
    imageUrl: string; // Make sure this is required if you're using it
    eventoUrl?: string; // Make sure this is required if you're using it

}

