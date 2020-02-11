import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
export type ItemsQuery = {
    items: Item[];
  }

export type Item = {
  id: number;
  name: string;
  title: string;
  description: string;
  supportDevice: string
};


export const DELETE_ITEM_MUTATION = gql`
mutation deleteItemMutation($id:String!){
  deleteItem(id: $id){
    id
    title
    price
    description
    supportDevice
  }
}
`;

export const CREATE_ITEM_MUTATION = gql`
mutation createItemMutation($title:String!, $price: Int!, $description: String!, $supportDevice: String!){
  createItem(input:{title: $title, price: $price, description: $description, supportDevice: $supportDevice }){
    id
    title
    price
    description
    supportDevice
  }
}
`;

export const UPDATE_ITEM_MUTATION = gql`
mutation updateItemMutation($id:String!, $title:String!, $price: Int!, $description: String!, $supportDevice: String!){
  updateItem(id: $id, input:{title: $title, price: $price, description: $description, supportDevice: $supportDevice}){
    id
    title
    price
    description
    supportDevice
  }
}
`;

export const GET_ALL_ITEMS =  gql`
query getallitemsQuery
{
  items{
    id,
    title,
    price,
    description,
    supportDevice
  }
}
`;
