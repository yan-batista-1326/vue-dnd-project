<template>
    <v-data-table :headers="headers" :items="monstros" sort-by="cr">

        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>My CRUD</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>

                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"> Novo Monstro </v-btn>
                    </template>

                    <v-card>
                        <v-card-title> <span class="headline">{{ formTitle }}</span> </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.id" label="ID*" required type="number"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.cr" label="CR*" hint="Nível de dificuldade" required type="number" max="9" min="0"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6" md="4">
                                        <v-select :items="types" label="Tipo*" v-model="editedItem.tipo"></v-select>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field v-model="editedItem.nome" label="Nome*" hint="Nome do Monstro" required></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-select :items="sizes" label="Tamanho*" v-model="editedItem.tamanho"></v-select>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-select :items="align" label="Alinhamento*" v-model="editedItem.alinhamento"></v-select>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-select v-model="editedItem.ambiente" :items="ambientes" attach chips label="Ambiente*" multiple></v-select>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close"> Fechar </v-btn>
                            <v-btn color="blue darken-1" text @click="save"> Salvar </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="headline">Tem certeza que deseja apagar esse item?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">Não</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">Sim</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

            </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="inicializa"> Reset </v-btn>
        </template>
    </v-data-table>
</template>

<script>
import axios from "axios";

export default {
    name: "Magias",
    data () {
        return {
            dialog: false,
            dialogDelete: false,
            headers: [
                {text: "CR", value: "cr"},
                {text: "Nome", value: "nome"},
                {text: "Tipo", value: "tipo"},
                {text: "Tamanho", value: "tamanho"},
                {text: "Alinhamento", value: "alinhamento"},
                {text: "Ambiente", value: "ambiente"},
                {text: "Ações", value: "actions", sortable: false}
            ],
            monstros: [], //Pega do Banco de dados a partir do método Inicializa
            ambientes: ["Arctic", "Coastal", "Desert", "Forest", "Grassland", "Hill", "Mountain", "Swamp", "Underdark", "Underwater", "Urbano"],
            sizes: ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"],
            align: ["Leal Bom", "Neutro Bom", "Caótico Bom", "Leal Netro", "Neutro", "Caótico Neutro", "Leal Mal", "Neutro Mal", "Caótico Mal", "Sem alinhamento"],
            types: ["Aberração", "Besta", "Celestial", "Constructo", "Dragão", "Elemental", "Feérico", "Abissal", "Gigante", "Humanoide", "Monstruosidade", "Lodoso", "Planta", "Morto-vivo"],
            editedIndex: -1,
            editedItem: {
                id: 0,
                cr: 0,
                nome: "",
                tipo: "",
                tamanho: "",
                alinhamento: "",
                ambiente: ""
            },
            defaultItem: {
                id: 0,
                cr: 0,
                nome: "",
                tipo: "",
                tamanho: "",
                alinhamento: "",
                ambiente: ""
            },
        } 
    },
    methods: {
        inicializa() {
            axios("http://localhost:3000/monstros")
            .then((response) => {
                this.monstros = response.data;
            })
            .catch((error) => console.log(error))
        },
        close() {
            this.dialog = false;
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            }, 300);
        },
        save() {
            if (this.editedIndex > -1) { //alteração
                axios.put("http://localhost:3000/monstros/" + this.editedItem.id, this.editedItem)
                .then(response => {
                    console.log(response);
                    Object.assign(this.monstros[this.editedIndex], this.editedItem);
                    this.close();
                })
                .catch(error => console.log(error));
            } else {
                axios.post("http://localhost:3000/monstros", this.editedItem)
                .then(response => {
                    console.log(response);
                    this.monstros.push(this.editedItem);
                    this.close();
                })
                .catch(error => console.log(error));
            }
        },
        editItem(item) {
            this.editedIndex = this.monstros.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },
        deleteItem(item) {
            this.editedIndex = item.id
            this.editedItem = Object.assign({}, item)
            console.log(this.editedIndex);
            this.dialogDelete = true
        },
        deleteItemConfirm () {
            axios.delete("http://localhost:3000/monstros/" + this.editedIndex)
            .then(response => {
                console.log(response.data);
                this.monstros.splice(this.editedIndex, 1);
            })
            .catch(error => console.log(error));
            this.closeDelete();
        },
        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "Novo Item" : "Editar Item"
        }
    },
    created() {
        this.inicializa();
    }
}
</script>