import { FormDataKeys, FormDataValues } from '../../types/form';

export const FORM_DATA: { [key in FormDataKeys]: FormDataValues } = {
  TITLE: 'title',
  DESCRIPTION: 'description',
  DATE: 'date',
  TIME: 'time',
  COLOR: 'color',
};
