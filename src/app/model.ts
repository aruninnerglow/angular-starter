export enum WindowTypes {
    DESKTOP = 'DESKTOP',
    LAPTOP = 'LAPTOP',
    TABLETS = 'TABLETS',
    LARGE_PHONE = 'LARGE_PHONE',
    PHONE = 'PHONE'
  }

export enum SkillRating {
    NOVICE = 'Novice',
    BEGINNER = 'Beginner',
    COMPETENT = 'Competent',
    PROFICIENT = 'Proficient',
    EXPORT = 'Export'
  }

export enum GridConfig {
    DESKTOP = 'ALL',
    LAPTOP = '4',
    TABLETS = '3',
    LARGE_PHONE = '2',
    PHONE = '1'
  }

export class GridColumnConfig {
  
  static userGrid = [
    {
      headerName:'User ID',
      field: 'id'
    },
    {
      headerName:'First Name',
      field: 'title'
    },
    {
      headerName:'Last Name',
      field: 'description'
    },
    {
      headerName:'Skills',
      width:'60',
      field: 'price',
      cellStyle: {color: 'red',  backgroundColor: '#aaffaa'}
    },
    {
      headerName:'Rating',
      width:'60',
      field: 'supportDevice'
    }
  ]

}