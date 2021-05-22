import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { TableFilterComponent } from '../table-filter/table-filter.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges {
  @Output() tableRowInfo = new EventEmitter<any>();
  dataSource!: MatTableDataSource<any>;
  private sort: MatSort | any;
  @Input() isFilterable = false;

  @ViewChild(MatSort, {static: false}) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild('tableFilter', { static: false })
  tableFilter!: TableFilterComponent;

  public displayColumns: string[] = [];

  public columnConfig: Array<any> = [
    {
      header: 'Filename',
      key: 'fileName'
    },
    {
      header: 'Vendor',
      key: 'vendor'
    },
    {
      header: 'Channel',
      key: 'channel'
    },
    {
      header: 'Remark',
      key: 'remark'
    },
    {
      header: 'Status',
      key: 'status'
    },
    {
      header: 'Uploaded Date',
      key: 'uploadedDate'
    }
  ];

  public rows: any[] = [
    {fileName: '3M-March-2021.csv', vendor: '3M', channel: 'FTP', remark: 'Need Attention', status: 'Proessing Error', uploadedDate: '20 May 2021'},
    {fileName: 'Apple-March-2021.csv', vendor: 'Apple', channel: 'Email', remark: 'Processing', status: 'Awaiting Approval', uploadedDate: '20 May 2021'},
    {fileName: 'Amazon-March-2021.csv', vendor: 'Amazon', channel: 'Paper', remark: 'Completed', status: 'Proessing Error', uploadedDate: '15 Jan 2021'},
    {fileName: '3M-March-2021.csv', vendor: '3M', channel: 'API', remark: 'Completed', status: 'Awaiting Error Correction', uploadedDate: '20 Jan 2021'},
    {fileName: 'Apple-March-2021.csv', vendor: 'Apple', channel: 'FTP', remark: 'Completed', status: 'Awaiting JDE Verification', uploadedDate: '30 Jan 2021'},
    {fileName: 'Apple-March-2021.csv', vendor: 'Apple', channel: 'Email', remark: 'Processing', status: 'Proessing Error', uploadedDate: '11 Jan 2021'},
    {fileName: '3M-March-2021.csv', vendor: '3M', channel: 'Email', remark: 'Processing', status: 'Awaiting Approval', uploadedDate: '09 Jan 2021'},
    {fileName: '3M-March-2021.csv', vendor: '3M', channel: 'API', remark: 'Need Attention', status: 'Awaiting Error Correction', uploadedDate: '08 Jan 2021'},
    {fileName: 'Amazon-March-2021.csv', vendor: 'Amazon', channel: 'API', remark: 'Need Attention', status: 'Proessing Error', uploadedDate: '06 Jan 2021'},
    {fileName: 'Amazon-March-2021.csv', vendor: 'Amazon', channel: 'Paper', remark: 'Processing', status: 'Awaiting JDE Verification', uploadedDate: '05 Jan 2021'},
    {fileName: 'Amazon-March-2021.csv', vendor: 'Amazon', channel: 'FTP', remark: 'Completed', status: 'Awaiting JDE Verification', uploadedDate: '02 Jan 2021'},
    {fileName: 'Apple-March-2021.csv', vendor: 'Apple', channel: 'FTP', remark: 'Completed', status: 'Proessing Error', uploadedDate: '03 Jan 2021'},
    {fileName: '3M-March-2021.csv', vendor: '3M', channel: 'Email', remark: 'Completed', status: 'Awaiting Error Correction', uploadedDate: '04 Jan 2021'},
    {fileName: '3M-March-2021.csv', vendor: '3M', channel: 'Email', remark: 'Processing', status: 'Proessing Error', uploadedDate: '27 Jan 2021'},
    {fileName: 'Apple-March-2021.csv', vendor: 'Apple', channel: 'FTP', remark: 'Need Attention', status: 'Awaiting Approval', uploadedDate: '13 Jan 2021'},
    {fileName: 'Amazon-March-2021.csv', vendor: 'Amazon', channel: 'Paper', remark: 'Need Attention', status: 'Awaiting Error Correction', uploadedDate: '11 Jan 2021'},
    {fileName: 'Apple-March-2021.csv', vendor: 'Apple', channel: 'API', remark: 'Completed', status: 'Proessing Error', uploadedDate: '12 Jan 2021'},
    {fileName: 'Apple-March-2021.csv', vendor: 'Apple', channel: 'Email', remark: 'Processing', status: 'Awaiting JDE Verification', uploadedDate: '26 Jan 2021'},
    {fileName: 'Amazon-March-2021.csv', vendor: 'Amazon', channel: 'FTP', remark: 'Processing', status: 'Awaiting Error Correction', uploadedDate: '21 Jan 2021'},
  ];

  public tableData: any[] = [];
  public filterColumn: String =  '';
  public filterType: any
  public filterApplied: boolean = false

  public filterObj: any = {
    fileName: {
      key: 'fileName',
      filterType: 'input',
      filteredValue: ''
    },
    vendor: {
      key: 'vendor',
      filterType: 'input',
      filteredValue: ''
    },
    channel: {
      key: 'channel',
      filterType: 'dropdown',
      filteredValue: []
    },
    remark: {
      key: 'remark',
      filterType: 'dropdown',
      filteredValue: []
    },
    status: {
      key: 'status',
      filterType: 'dropdown',
      filteredValue: []
    },
    uploadedDate: {
      key: 'uploadedDate',
      filterType: 'date',
      filteredValue: { 
        singleFilterType: 
        { 
          value: '',
          dataFilterType: ''
        },
      rangeFilterType: {
        min: '',
        max: ''
      } }
    }
  }
  ngOnInit() {
    if (this.displayColumns) {
      this.columnConfig.forEach((element: any )=> {
        this.displayColumns.push(element.key)
      });
    }
    if (this.rows) {
      this.tableData = this.rows
      this.dataSource = new MatTableDataSource(this.rows);
    }

  }
  ngOnChanges(): any {
    // if (this.rows) {
    //   console.log('data', this.rows)
    //   this.dataSource = new MatTableDataSource(this.rows);
    // }
  }

  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
    if (this.rows && this.dataSource && this.dataSource.data && this.dataSource.data.length) {
      this.dataSource.sort = this.sort;
      this.sort.disableClear = false;
    }
  }

  filterTable(event: any) {
    this.filterColumn = event,
    this.filterType = this.filterObj[event].filterType
    this.filterApplied = true
  }

  getFilteredData(data: any) {
    this.dataSource = new MatTableDataSource(data)
    this.tableData = this.dataSource.data
  }
  onFileClick(event: any) {
    this.tableRowInfo.emit(event);
  }

  filterObjEmit(event: any) {
    this.filterObj = new Object({...event})
  }

  /**
   * clearing the filter as well as json and the existing filter data
   */
  clearAll() {
    this.dataSource = new MatTableDataSource(this.rows)
    const obj = this.filterObj
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const element = obj[key];
        element.filteredValue = null
      }
    }
    this.filterObj = new Object({...obj})
    this.tableFilter.input_value = ''
    this.tableFilter.selectedDateType = ''
    this.tableFilter.singleDateSelected = ''
    this.tableFilter.minDateSelected = ''
    this.tableFilter.maxDateSelected = ''
   }
}
