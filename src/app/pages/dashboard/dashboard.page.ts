import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexTheme
} from "ng-apexcharts";
import { Transaction } from 'src/app/models/transaction';
import { User } from 'src/app/models/user';
import { DataFireStoreService } from 'src/app/shared/services/data-fire-store.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TranslateValueService } from 'src/app/shared/services/translateValue.service';
import { AppConst } from 'src/app/shared/utils/const';
import { DbKey } from 'src/app/shared/utils/dbKey';

export type ChartAreaOptions = {
  series: ApexAxisChartSeries;
  chartArea: ApexChart;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  colors: string[];
  theme: ApexTheme;
};

export type ChartBarOptions = {
  series: ApexAxisChartSeries;
  chartBar: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  colors: string[];
  theme: ApexTheme;
};

export type ChartCircleOptions = {
  series: ApexNonAxisChartSeries;
  chartCircle: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  theme: ApexTheme;
};

// Función para obtener el año de una fecha en formato "yyyy-mm-dd"
function getYearMonthFromDate(dateString: string): string {
  return dateString.split('-').slice(0, 2).join('-');
}

function convertMonthNumberToName(monthNumber: string): string {
  const months = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ];
  const index = parseInt(monthNumber) - 1;
  return months[index];
}

function getTotalAmountByYearAndMonth(data: any[]): { year: number, month: string, total: number }[] {
  const result: { [yearMonth: string]: number } = {};
  data.forEach(transaction => {
    const yearMonth = getYearMonthFromDate(transaction.createDate);
    if (!result[yearMonth]) {
      result[yearMonth] = 0;
    }
    result[yearMonth] += transaction.amount;
  });

  return Object.keys(result).map(yearMonth => {
    const [year, month] = yearMonth.split('-');
    return { year: parseInt(year), month: convertMonthNumberToName(month), total: result[yearMonth] };
  });
}

function filterTransactionsByYear(transactions: any[], year: number): any[] {
  return transactions.filter(transaction => {
    const transactionYear = new Date(transaction.createDate).getFullYear();
    return transactionYear === year;
  });
}

function isObjectEmpty(obj: any): boolean {
  return Object.keys(obj).length === 0;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})


export class DashboardPage implements OnInit {

  title: string = '';
  user: User;
  dateNow: Date;
  lang: string;
  transactions: Transaction[] = [];
  allCategories: any = {};
  categories: any = {};

  incomeData: any = {};
  expenseData: any = {};
  transactioIncome: any = {};
  transactioExpense: any = {};

  incomeTotal: number = 0;
  expenseTotal: number = 0;
  balance: number = 0;

  years: any[] = [];
  theme: boolean = false;

  @ViewChild("chartArea") chartArea: ChartComponent;
  public chartAreaOptions: Partial<ChartAreaOptions>;

  @ViewChild("chartBar") chartBar: ChartComponent;
  public chartBarOptions: Partial<ChartBarOptions>;

  @ViewChild("chartCircle") chart: ChartComponent;
  public chartCircleOptions: Partial<ChartCircleOptions>;

  constructor(private storage: StorageService,
    private router: Router,
    private dataService: DataFireStoreService,
    private _t: TranslateValueService) {

    this.user = {};
    this.dateNow = new Date();
    this.chartAreaOptions = {
      series: [],
      chartArea: {
        height: 250,
        type: "area",
        toolbar: {
          show: false
        }
      },
      colors: ["#23C296", "#eb445a"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      grid: {
        show: false
      },
      xaxis: {
        type: "category",
        categories: []
      },
      yaxis: {
        show: false
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };

    this.chartBarOptions = {
      series: [],
      chartBar: {
        type: "bar",
        height: 250,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        }
      },
      colors: ["#23C296", "#eb445a"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      grid: {
        show: false
      },
      xaxis: {
        categories: []
      },
      yaxis: {
        show: false
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val;
          }
        }
      }
    };

    this.chartCircleOptions = {
      series: [0],
      theme: {
        mode: this.theme ? "dark" : "light"
      },
      chartCircle: {
        type: "radialBar",
        offsetY: 0,
        background: "transparent"
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: "95%",
            margin: 5, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              opacity: 0.31,
              blur: 2
            }
          },
          dataLabels: {
            name: {
              fontSize: "24px",
              color: undefined,
              offsetY: 35
            },
            value: {
              offsetY: -15,
              fontSize: "26px",
              fontWeight: 'bold',
              color: undefined,
              formatter: function (val) {
                return "$" + val;
              }
            }
          }
        }
      },
      labels: ['']
    };
  }

  ngOnInit() {
    this.title = this._t.l('Title.dashboard');

  }

  async ionViewDidEnter() {
    this.theme = await this.storage.get(DbKey.ThemeModeKey);
    this.user = await this.storage.get(DbKey.LOCAL_USER);
    this.storage.get(DbKey.languageKey).then((lang) => {
      if (!lang) {
        return lang = 'en';
      }
      this.lang = lang;
    });
    const now = new Date();
    const year = now.getFullYear();
    this.getDataAccountsByFilter(year);

    this.dataService.getListDoc<any>(AppConst.DocTransaction, this.user.id).subscribe((result) => {
      this.transactions = result;
      // Convertir las cadenas de fecha en objetos Date
      result.forEach(item => {
        item.createDate = new Date(item.createDate);
      });

      // Ordenar los objetos por fecha de forma ascendente
      result.sort((a, b) => b.createDate - a.createDate);

      // Seleccionar los últimos 30 registros
      this.transactions = result.slice(-30);
    });
  }

  onClickProfile() {
    this.router.navigateByUrl(AppConst.Profile);
  }

  async getDataAccountsByFilter(year: number) {
    // Calcular el total de ingresos y egresos por cuenta
    this.dataService.getTransactionByCode<any>(AppConst.DocTransaction, 'I', this.user.id).subscribe((dataI) => {
      // Calcular el total de ingresos
      this.transactioIncome = filterTransactionsByYear(dataI, year);
      this.incomeTotal = this.transactioIncome.reduce((total, transaction) => total + transaction.amount, 0);
      this.incomeData = getTotalAmountByYearAndMonth(this.transactioIncome);
      this.updateChartArea();
      this.upateChartBar();
      this.updateChartCircle();
    });

    this.dataService.getTransactionByCode<any>(AppConst.DocTransaction, 'E', this.user.id).subscribe((dataE) => {
      this.transactioExpense = filterTransactionsByYear(dataE, year);
      this.expenseTotal = this.transactioExpense.reduce((total, transaction) => total + transaction.amount, 0);
      this.expenseData = getTotalAmountByYearAndMonth(this.transactioExpense);
      this.updateChartArea();
      this.upateChartBar();
      this.updateChartCircle();
    });
  }

  //#region Dashboard
  //#region Type Area
  updateChartArea() {
    if (!isObjectEmpty(this.incomeData) && !isObjectEmpty(this.expenseData)) {

      const allCategoriesSet = new Set([
        ...this.incomeData.map(item => item.month),
        ...this.expenseData.map(item => item.month)
      ]);
      const allYearSet = new Set([
        ...this.incomeData.map(item => item.year),
        ...this.expenseData.map(item => item.year)
      ]);


      const categories = Array.from(allCategoriesSet).sort();
      this.years = Array.from(allYearSet).sort();
      const incomeData = this.incomeData.map(item => item.total); // Obtener los totales de ingresos
      const expenseData = this.expenseData.map(item => item.total); // Obtener los totales de gastos

      this.chartAreaOptions = {
        series: [
          {
            name: this._t.l("Label.income"),
            data: incomeData,
          },
          {
            name: this._t.l("Label.expenses"),
            data: expenseData,
          }
        ],
        theme: {
          mode: this.theme ? "dark" : "light"
        },
        chartArea: {
          height: 275,
          type: "area",
          offsetY: 0,
          background: "transparent",
          toolbar: {
            show: false
          }
        },
        colors: ["#23C296", "#eb445a"],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
        },
        grid: {
          show: false
        },
        xaxis: {
          type: "category",
          categories: categories
        },
        yaxis: {
          show: false
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm"
          }
        }
      };
    }
  }
  //#endregion

  //#region 
  updateChartCircle() {
    if (!isObjectEmpty(this.incomeData) && !isObjectEmpty(this.expenseData)) {
      this.balance = (this.incomeTotal - this.expenseTotal) as number;
      const total = (this.incomeTotal + this.expenseTotal) as number;
      let porcentajeBalanceIngreso = (this.balance / total) * 100;

      this.chartCircleOptions = {
        series: [Math.round(porcentajeBalanceIngreso)],
        theme: {
          mode: this.theme ? "dark" : "light"
        },
        chartCircle: {
          type: "radialBar",
          offsetY: 0,
          background: "transparent"
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: "#e7e7e7",
              strokeWidth: "95%",
              margin: 5, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: 2,
                left: 0,
                opacity: 0.31,
                blur: 2
              }
            },
            dataLabels: {
              name: {
                fontSize: "24px",
                color: '#23C296',
                offsetY: 40
              },
              value: {
                offsetY: -15,
                fontSize: "26px",
                fontWeight: 'bold',
                color: undefined,
                formatter: function (val) {
                  return val + '%';
                }
              }
            }
          }
        },
        labels: [this._t.l('Label.totalBalance') + ' $ ' + this.balance.toFixed(2)]
      };
    }
  }
  //#endregion

  //#region Type bar
  upateChartBar() {
    if (!isObjectEmpty(this.transactioIncome) && !isObjectEmpty(this.transactioExpense)) {
      // Unificar las transacciones de ingresos y egresos
      const allTransactions = [...this.transactioIncome, ...this.transactioExpense];

      // Agrupar transacciones por cuenta, tipo de cuenta y año
      const groupedTransactions = allTransactions.reduce((acc, transaction) => {
        const year = new Date(transaction.createDate).getFullYear();
        const key = `${transaction.accountName}-${transaction.type === 'I' ? this._t.l("Label.income") : this._t.l("Label.expenses")}-${year}`;
        if (!acc[key]) {
          acc[key] = {
            account: transaction.accountName,
            typeAccount: transaction.type === 'I' ? this._t.l("Label.income") : this._t.l("Label.expenses"),
            total: 0,
            year: year,
          };
        }
        acc[key].total += transaction.amount;
        return acc;
      }, {});

      // Convertir el objeto agrupado en un arreglo de objetos
      const result = Object.values(groupedTransactions) as any;

      // Agrupar los datos por tipo de cuenta
      const groupedData = result.reduce((acc, item) => {
        if (!acc[item.typeAccount]) {
          acc[item.typeAccount] = [];
        }
        acc[item.typeAccount].push(item.total);
        return acc;
      }, {});

      // Obtener la lista de todas las cuentas únicas
      const allAccountsSet = new Set(result.map(item => item.account));
      const allAccounts = Array.from(allAccountsSet);

      // Crear el objeto de series y categorías
      const series = Object.keys(groupedData).map(type => ({
        name: type,
        data: groupedData[type]
      }));

      const categories = allAccounts;
      // Configuración del gráfico
      this.chartBarOptions = {
        series,
        chartBar: {
          type: "bar",
          height: 275,
          offsetY: 0,
          background: "transparent",
          toolbar: {
            show: false
          }
        },
        theme: {
          mode: this.theme ? "dark" : "light"
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
          }
        },
        colors: ["#23C296", "#eb445a"],
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        grid: {
          show: false
        },
        xaxis: {
          categories
        },
        yaxis: {
          show: false
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val;
            }
          }
        }
      };
    }
  }
  //#endregion

  //#endregion
}
