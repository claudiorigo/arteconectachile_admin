export const AsideMenuAdminGeneral = {
    items: [
      {
        title: 'Dashboard',
        root: true,
        name: "dashboard",
        icon: 'flaticon2-architecture-and-city',
        svg: './assets/media/svg/icons/Design/Layers.svg',
        page: '/dashboard',
        translate: 'MENU.DASHBOARD',
        bullet: 'dot',
      },
      { section: 'Usuario' },
      {
        title: 'Usuarios',
        root: true,
        name: "users",
        bullet: 'dot',
        icon: 'flaticon2-user-outline-symbol',
        svg: './assets/media/svg/icons/General/User.svg',
        page: '/users',
        submenu: [
          {
            title: 'Gestion Usuarios',
            page: '/users/list'
          }
        ]
      },
      //
      { section: 'Productos' },
      {
        title: 'Categorías',
        root: true,
        name: "categorias",
        bullet: 'dot',
        icon: 'flaticon2-user-outline-symbol',
        svg: './assets/media/svg/icons/Home/Commode2.svg',
        page: '/categorias',
        submenu: [
          {
            title: 'Gestión Categoría',
            page: '/categorias/lista'
          }
        ]
      },
      //      
      {
        title: 'Productos',
        root: true,
        name: "productos",
        bullet: 'dot',
        icon: 'flaticon2-user-outline-symbol',
        svg: './assets/media/svg/icons/Clothes/Briefcase.svg',
        page: '/productos',
        submenu: [
          {
            title: 'Gestión Producto',
            page: '/productos/add-product'
          },
          {
            title: 'Listar Productos',
            page: '/productos/list-product'
          }
        ]
      },
      //      
      {
        title: 'Sliders',
        root: true,
        name: "sliders",
        bullet: 'dot',
        icon: 'flaticon2-user-outline-symbol',
        svg: './assets/media/svg/icons/Devices/Display2.svg',
        page: '/sliders',
        submenu: [
          {
            title: 'Listar Sliders',
            page: '/sliders/listar'
          }
        ]
      },
      //      
      {
        title: 'Cupones',
        root: true,
        name: "coupons",
        bullet: 'dot',
        icon: 'flaticon2-user-outline-symbol',
        svg: './assets/media/svg/icons/Shopping/Ticket.svg',
        page: '/cupones',
        submenu: [
          {
            title: 'Registrar Cupón',
            page: '/cupones/registrar-cupon'
          },
          {
            title: 'Listar Cupones',
            page: '/cupones/listar-cupones'
          }
        ]
      },
      //      
      {
        title: 'Descuentos',
        root: true,
        name: "discount",
        bullet: 'dot',
        icon: 'flaticon2-user-outline-symbol',
        svg: './assets/media/svg/icons/Shopping/Dollar.svg',
        page: '/descuentos',
        submenu: [
          {
            title: 'Registrar Descuento',
            page: '/descuentos/registrar-descuento'
          },
          {
            title: 'Listar Descuento',
            page: '/descuentos/listar-descuento'
          }
        ]
      },
    ]
}