const messages: any = {
  pt: {
    translations: {
      mainDrawer: {
        listItems: {
          dashboard: "Dashboard",
          tickets: "Tickets",
          contacts: "Contatos",
          quickMessages: "Respostas Rápidas",
          tasks: "Tarefas",
          schedules: "Agendamentos",
          tags: "Tags",
          chats: "Chats",
          helps: "Ajuda",
          administration: "Administração",
          campaigns: "Campanhas",
          flows: "Fluxos",
          annoucements: "Anúncios",
          prompts: "Prompts",
          queueIntegration: "Integrações",
          connections: "Conexões",
          files: "Arquivos",
          queues: "Filas",
          users: "Usuários",
          messagesAPI: "API de Mensagens",
          financeiro: "Financeiro",
          settings: "Configurações",
        },
        appBar: {
          greeting: {
            hello: "Olá",
            welcome: "bem-vindo ao",
            active: "Ativa até",
          },
          user: {
            profile: "Perfil",
            logout: "Sair",
          },
          refresh: "Atualizar",
        },
      },
      dashboard: {
        counters: {
          inTalk: "Em Atendimento",
          waiting: "Aguardando",
          finished: "Finalizados",
          newContacts: "Novos Contatos",
          averageTalkTime: "T.M. de Atendimento",
          averageWaitTime: "T.M. de Espera",
        },
        filters: {
          filterType: {
            title: "Tipo de Filtro",
            options: {
              perDate: "Por Data",
              perPeriod: "Por Período",
            },
            helper: "Selecione o tipo de filtro",
          },
          initialDate: "Data Inicial",
          finalDate: "Data Final",
        },
        periodSelect: {
          title: "Período",
          options: {
            none: "Nenhum",
            last3: "Últimos 3 dias",
            last7: "Últimos 7 dias",
            last15: "Últimos 15 dias",
            last30: "Últimos 30 dias",
            last60: "Últimos 60 dias",
            last90: "Últimos 90 dias",
          },
          helper: "Selecione o período",
        },
        buttons: {
          filter: "Filtrar",
        },
        toasts: {
          selectFilterError: "Selecione um filtro antes de continuar",
        },
      },
      tickets: {
        search: "Buscar tickets...",
        noTickets: "Nenhum ticket encontrado",
        tabs: {
          open: "Abertos",
          pending: "Aguardando",
          closed: "Finalizados",
        },
        actions: {
          accept: "Aceitar",
          transfer: "Transferir",
          resolve: "Resolver",
        },
      },
      chat: {
        noTicketMessage: "Selecione um ticket para começar",
      },
      ticketAdvanced: {
        selectTicket: "Selecionar Ticket",
        ticketNav: "Ticket",
        attendanceNav: "Atendimentos",
      },
      connections: {
        title: "Conexões",
        buttons: {
          add: "Adicionar WhatsApp",
          qrcode: "QR CODE",
          tryAgain: "Tentar Novamente",
          newQr: "Novo QR CODE",
          disconnect: "Desconectar",
          connecting: "Conectando",
        },
        table: {
          name: "Nome",
          status: "Status",
          session: "Sessão",
          lastUpdate: "Última Atualização",
          default: "Padrão",
          actions: "Ações",
        },
        toolTips: {
          disconnected: {
            title: "Desconectado",
            content: "Falha ao conectar com WhatsApp",
          },
          qrcode: {
            title: "Aguardando leitura do QR Code",
            content: "Clique no botão 'QR CODE' e escaneie",
          },
          connected: {
            title: "Conectado",
          },
          timeout: {
            title: "Conexão com o WhatsApp perdida",
            content: "Certifique-se que o celular esteja conectado à internet",
          },
        },
        confirmationModal: {
          disconnectTitle: "Desconectar",
          disconnectMessage: "Tem certeza? Você precisará escanear o QR Code novamente.",
          deleteTitle: "Deletar",
          deleteMessage: "Tem certeza? Esta ação não pode ser revertida.",
        },
        toasts: {
          deleted: "Conexão WhatsApp deletada com sucesso.",
        },
      },
      contacts: {
        title: "Contatos",
        buttons: {
          add: "Adicionar Contato",
          import: "Importar Contatos",
          export: "Exportar Contatos",
        },
        table: {
          name: "Nome",
          whatsapp: "WhatsApp",
          email: "Email",
          actions: "Ações",
        },
        searchPlaceholder: "Buscar contato...",
        confirmationModal: {
          deleteTitle: "Deletar",
          deleteMessage: "Tem certeza que deseja deletar este contato?",
          importTitle: "Importar contatos",
          importMessage: "Deseja importar todos os contatos do WhatsApp?",
        },
        toasts: {
          deleted: "Contato deletado com sucesso.",
        },
      },
      whatsappModal: {
        title: {
          add: "Adicionar WhatsApp",
          edit: "Editar WhatsApp",
        },
        form: {
          name: "Nome",
          default: "Padrão",
        },
        buttons: {
          cancel: "Cancelar",
          save: "Salvar",
        },
        success: {
          add: "WhatsApp adicionado com sucesso.",
          edit: "WhatsApp editado com sucesso.",
        },
      },
      qrcodeModal: {
        title: "QR Code",
        message: "Escaneie o QR Code para conectar",
        waiting: "Aguardando QR Code...",
      },
      contactModal: {
        title: {
          add: "Adicionar Contato",
          edit: "Editar Contato",
        },
        form: {
          name: "Nome",
          number: "Número",
          email: "Email",
        },
        buttons: {
          cancel: "Cancelar",
          save: "Salvar",
        },
        success: {
          add: "Contato adicionado com sucesso.",
          edit: "Contato editado com sucesso.",
        },
      },
      newTicketModal: {
        title: "Criar Ticket",
        form: {
          queue: "Selecione uma fila",
        },
        buttons: {
          cancel: "Cancelar",
          create: "Criar",
        },
        success: "Ticket criado com sucesso.",
        errors: {
          selectQueue: "Selecione uma fila.",
        },
      },
      importContactsModal: {
        title: "Importar Contatos",
        buttons: {
          selectFile: "Selecionar Arquivo CSV",
          cancel: "Cancelar",
          upload: "Importar",
        },
        hint: "Formato: nome;número;email",
        success: "Contatos importados com sucesso.",
        errors: {
          invalidFile: "Arquivo inválido. Selecione um arquivo CSV.",
          selectFile: "Selecione um arquivo primeiro.",
        },
      },
      confirmationModal: {
        buttons: {
          cancel: "Cancelar",
          confirm: "Confirmar",
        },
      },
      users: {
        title: "Usuários",
        table: {
          id: "ID",
          name: "Nome",
          email: "Email",
          profile: "Perfil",
          actions: "Ações",
        },
        buttons: {
          add: "Adicionar Usuário",
        },
        toasts: {
          deleted: "Usuário deletado com sucesso.",
        },
        confirmationModal: {
          deleteTitle: "Deletar",
          deleteMessage: "Tem certeza que deseja deletar este usuário?",
        },
      },
      userModal: {
        title: {
          add: "Adicionar Usuário",
          edit: "Editar Usuário",
        },
        form: {
          name: "Nome",
          email: "Email",
          password: "Senha",
          profile: "Perfil",
          profiles: {
            user: "Usuário",
            admin: "Admin",
          },
        },
        buttons: {
          cancel: "Cancelar",
          save: "Salvar",
        },
        success: {
          add: "Usuário adicionado com sucesso.",
          edit: "Usuário editado com sucesso.",
        },
      },
      queues: {
        title: "Filas",
        table: {
          id: "ID",
          name: "Nome",
          color: "Cor",
          orderQueue: "Ordem",
          greeting: "Mensagem de Saudação",
          actions: "Ações",
        },
        buttons: {
          add: "Adicionar Fila",
        },
        toasts: {
          deleted: "Fila deletada com sucesso.",
        },
        confirmationModal: {
          deleteTitle: "Deletar",
          deleteMessage: "Tem certeza que deseja deletar esta fila?",
        },
      },
      queueModal: {
        title: {
          add: "Adicionar Fila",
          edit: "Editar Fila",
        },
        form: {
          name: "Nome",
          color: "Cor",
          greetingMessage: "Mensagem de Saudação",
          orderQueue: "Ordem",
        },
        buttons: {
          cancel: "Cancelar",
          save: "Salvar",
        },
        success: {
          add: "Fila adicionada com sucesso.",
          edit: "Fila editada com sucesso.",
        },
      },
      tags: {
        title: "Tags",
        table: {
          name: "Nome",
          tickets: "Tickets",
          actions: "Ações",
        },
        buttons: {
          add: "Adicionar Tag",
        },
        toasts: {
          deleted: "Tag deletada com sucesso.",
        },
        confirmationModal: {
          deleteTitle: "Deletar",
          deleteMessage: "Tem certeza que deseja deletar esta tag?",
        },
      },
      tagModal: {
        title: {
          add: "Adicionar Tag",
          edit: "Editar Tag",
        },
        form: {
          name: "Nome",
          color: "Cor",
        },
        buttons: {
          cancel: "Cancelar",
          save: "Salvar",
        },
        success: {
          add: "Tag adicionada com sucesso.",
          edit: "Tag editada com sucesso.",
        },
      },
      quickMessages: {
        title: "Respostas Rápidas",
        searchPlaceholder: "Buscar...",
        table: {
          shortcode: "Atalho",
          mediaName: "Arquivo",
          actions: "Ações",
        },
        buttons: {
          add: "Adicionar",
        },
        toasts: {
          deleted: "Resposta rápida deletada com sucesso.",
        },
        confirmationModal: {
          deleteTitle: "Deletar",
          deleteMessage: "Tem certeza que deseja deletar esta resposta rápida?",
        },
        noAttachment: "Sem anexo",
      },
      quickMessageDialog: {
        title: {
          add: "Adicionar Resposta Rápida",
          edit: "Editar Resposta Rápida",
        },
        form: {
          shortcode: "Atalho",
          message: "Mensagem",
        },
        buttons: {
          cancel: "Cancelar",
          save: "Salvar",
          attachFile: "Anexar Arquivo",
        },
        success: {
          add: "Resposta rápida adicionada com sucesso.",
          edit: "Resposta rápida editada com sucesso.",
        },
      },
      settings: {
        success: "Configurações salvas com sucesso.",
        title: "Configurações",
        settings: {
          userCreation: {
            name: "Criação de usuário",
            options: {
              enabled: "Habilitado",
              disabled: "Desabilitado",
            },
          },
        },
      },
    },
  },
  en: {
    translations: {
      mainDrawer: {
        listItems: {
          dashboard: "Dashboard",
          tickets: "Tickets",
          contacts: "Contacts",
          quickMessages: "Quick Messages",
          tasks: "Tasks",
          schedules: "Schedules",
          tags: "Tags",
          chats: "Chats",
          helps: "Help",
          administration: "Administration",
          campaigns: "Campaigns",
          flows: "Flows",
          annoucements: "Announcements",
          prompts: "Prompts",
          queueIntegration: "Integrations",
          connections: "Connections",
          files: "Files",
          queues: "Queues",
          users: "Users",
          messagesAPI: "Messages API",
          financeiro: "Financial",
          settings: "Settings",
        },
        appBar: {
          greeting: {
            hello: "Hello",
            welcome: "welcome to",
            active: "Active until",
          },
          user: {
            profile: "Profile",
            logout: "Logout",
          },
          refresh: "Refresh",
        },
      },
      dashboard: {
        counters: {
          inTalk: "In Service",
          waiting: "Waiting",
          finished: "Finished",
          newContacts: "New Contacts",
          averageTalkTime: "Avg. Service Time",
          averageWaitTime: "Avg. Wait Time",
        },
        filters: {
          filterType: {
            title: "Filter Type",
            options: {
              perDate: "By Date",
              perPeriod: "By Period",
            },
            helper: "Select filter type",
          },
          initialDate: "Start Date",
          finalDate: "End Date",
        },
        periodSelect: {
          title: "Period",
          options: {
            none: "None",
            last3: "Last 3 days",
            last7: "Last 7 days",
            last15: "Last 15 days",
            last30: "Last 30 days",
            last60: "Last 60 days",
            last90: "Last 90 days",
          },
          helper: "Select period",
        },
        buttons: {
          filter: "Filter",
        },
        toasts: {
          selectFilterError: "Select a filter before continuing",
        },
      },
      tickets: {
        search: "Search tickets...",
        noTickets: "No tickets found",
        tabs: {
          open: "Open",
          pending: "Pending",
          closed: "Closed",
        },
        actions: {
          accept: "Accept",
          transfer: "Transfer",
          resolve: "Resolve",
        },
      },
      chat: {
        noTicketMessage: "Select a ticket to start",
      },
      ticketAdvanced: {
        selectTicket: "Select Ticket",
        ticketNav: "Ticket",
        attendanceNav: "Attendance",
      },
      connections: {
        title: "Connections",
        buttons: {
          add: "Add WhatsApp",
          qrcode: "QR CODE",
          tryAgain: "Try Again",
          newQr: "New QR CODE",
          disconnect: "Disconnect",
          connecting: "Connecting",
        },
        table: {
          name: "Name",
          status: "Status",
          session: "Session",
          lastUpdate: "Last Update",
          default: "Default",
          actions: "Actions",
        },
        toolTips: {
          disconnected: {
            title: "Disconnected",
            content: "Failed to connect with WhatsApp",
          },
          qrcode: {
            title: "Waiting for QR Code scan",
            content: "Click 'QR CODE' button and scan",
          },
          connected: {
            title: "Connected",
          },
          timeout: {
            title: "Connection with WhatsApp lost",
            content: "Make sure your phone is connected to the internet",
          },
        },
        confirmationModal: {
          disconnectTitle: "Disconnect",
          disconnectMessage: "Are you sure? You will need to scan the QR Code again.",
          deleteTitle: "Delete",
          deleteMessage: "Are you sure? This action cannot be undone.",
        },
        toasts: {
          deleted: "WhatsApp connection deleted successfully.",
        },
      },
      contacts: {
        title: "Contacts",
        buttons: {
          add: "Add Contact",
          import: "Import Contacts",
          export: "Export Contacts",
        },
        table: {
          name: "Name",
          whatsapp: "WhatsApp",
          email: "Email",
          actions: "Actions",
        },
        searchPlaceholder: "Search contact...",
        confirmationModal: {
          deleteTitle: "Delete",
          deleteMessage: "Are you sure you want to delete this contact?",
          importTitle: "Import contacts",
          importMessage: "Do you want to import all WhatsApp contacts?",
        },
        toasts: {
          deleted: "Contact deleted successfully.",
        },
      },
      whatsappModal: {
        title: {
          add: "Add WhatsApp",
          edit: "Edit WhatsApp",
        },
        form: {
          name: "Name",
          default: "Default",
        },
        buttons: {
          cancel: "Cancel",
          save: "Save",
        },
        success: {
          add: "WhatsApp added successfully.",
          edit: "WhatsApp edited successfully.",
        },
      },
      qrcodeModal: {
        title: "QR Code",
        message: "Scan the QR Code to connect",
        waiting: "Waiting for QR Code...",
      },
      contactModal: {
        title: {
          add: "Add Contact",
          edit: "Edit Contact",
        },
        form: {
          name: "Name",
          number: "Number",
          email: "Email",
        },
        buttons: {
          cancel: "Cancel",
          save: "Save",
        },
        success: {
          add: "Contact added successfully.",
          edit: "Contact edited successfully.",
        },
      },
      newTicketModal: {
        title: "Create Ticket",
        form: {
          queue: "Select a queue",
        },
        buttons: {
          cancel: "Cancel",
          create: "Create",
        },
        success: "Ticket created successfully.",
        errors: {
          selectQueue: "Select a queue.",
        },
      },
      importContactsModal: {
        title: "Import Contacts",
        buttons: {
          selectFile: "Select CSV File",
          cancel: "Cancel",
          upload: "Import",
        },
        hint: "Format: name;number;email",
        success: "Contacts imported successfully.",
        errors: {
          invalidFile: "Invalid file. Select a CSV file.",
          selectFile: "Select a file first.",
        },
      },
      confirmationModal: {
        buttons: {
          cancel: "Cancel",
          confirm: "Confirm",
        },
      },
    },
  },
  es: {
    translations: {
      mainDrawer: {
        listItems: {
          dashboard: "Dashboard",
          tickets: "Tickets",
          contacts: "Contactos",
          quickMessages: "Respuestas Rápidas",
          tasks: "Tareas",
          schedules: "Programaciones",
          tags: "Etiquetas",
          chats: "Chats",
          helps: "Ayuda",
          administration: "Administración",
          campaigns: "Campañas",
          flows: "Flujos",
          annoucements: "Anuncios",
          prompts: "Prompts",
          queueIntegration: "Integraciones",
          connections: "Conexiones",
          files: "Archivos",
          queues: "Colas",
          users: "Usuarios",
          messagesAPI: "API de Mensajes",
          financeiro: "Financiero",
          settings: "Configuraciones",
        },
        appBar: {
          greeting: {
            hello: "Hola",
            welcome: "bienvenido a",
            active: "Activo hasta",
          },
          user: {
            profile: "Perfil",
            logout: "Salir",
          },
          refresh: "Actualizar",
        },
      },
      dashboard: {
        counters: {
          inTalk: "En Servicio",
          waiting: "Esperando",
          finished: "Finalizados",
          newContacts: "Nuevos Contactos",
          averageTalkTime: "T.M. de Atención",
          averageWaitTime: "T.M. de Espera",
        },
        filters: {
          filterType: {
            title: "Tipo de Filtro",
            options: {
              perDate: "Por Fecha",
              perPeriod: "Por Período",
            },
            helper: "Seleccione el tipo de filtro",
          },
          initialDate: "Fecha Inicial",
          finalDate: "Fecha Final",
        },
        periodSelect: {
          title: "Período",
          options: {
            none: "Ninguno",
            last3: "Últimos 3 días",
            last7: "Últimos 7 días",
            last15: "Últimos 15 días",
            last30: "Últimos 30 días",
            last60: "Últimos 60 días",
            last90: "Últimos 90 días",
          },
          helper: "Seleccione el período",
        },
        buttons: {
          filter: "Filtrar",
        },
        toasts: {
          selectFilterError: "Seleccione un filtro antes de continuar",
        },
      },
      tickets: {
        search: "Buscar tickets...",
        noTickets: "No se encontraron tickets",
        tabs: {
          open: "Abiertos",
          pending: "En espera",
          closed: "Finalizados",
        },
        actions: {
          accept: "Aceptar",
          transfer: "Transferir",
          resolve: "Resolver",
        },
      },
      chat: {
        noTicketMessage: "Seleccione un ticket para comenzar",
      },
      ticketAdvanced: {
        selectTicket: "Seleccionar Ticket",
        ticketNav: "Ticket",
        attendanceNav: "Atenciones",
      },
      connections: {
        title: "Conexiones",
        buttons: {
          add: "Agregar WhatsApp",
          qrcode: "QR CODE",
          tryAgain: "Intentar Nuevamente",
          newQr: "Nuevo QR CODE",
          disconnect: "Desconectar",
          connecting: "Conectando",
        },
        table: {
          name: "Nombre",
          status: "Estado",
          session: "Sesión",
          lastUpdate: "Última Actualización",
          default: "Predeterminado",
          actions: "Acciones",
        },
        toolTips: {
          disconnected: {
            title: "Desconectado",
            content: "Error al conectar con WhatsApp",
          },
          qrcode: {
            title: "Esperando lectura del QR Code",
            content: "Haga clic en el botón 'QR CODE' y escanee",
          },
          connected: {
            title: "Conectado",
          },
          timeout: {
            title: "Conexión con WhatsApp perdida",
            content: "Asegúrese de que el celular esté conectado a internet",
          },
        },
        confirmationModal: {
          disconnectTitle: "Desconectar",
          disconnectMessage: "¿Está seguro? Deberá escanear el QR Code nuevamente.",
          deleteTitle: "Eliminar",
          deleteMessage: "¿Está seguro? Esta acción no se puede deshacer.",
        },
        toasts: {
          deleted: "Conexión WhatsApp eliminada con éxito.",
        },
      },
      contacts: {
        title: "Contactos",
        buttons: {
          add: "Agregar Contacto",
          import: "Importar Contactos",
          export: "Exportar Contactos",
        },
        table: {
          name: "Nombre",
          whatsapp: "WhatsApp",
          email: "Email",
          actions: "Acciones",
        },
        searchPlaceholder: "Buscar contacto...",
        confirmationModal: {
          deleteTitle: "Eliminar",
          deleteMessage: "¿Está seguro de que desea eliminar este contacto?",
          importTitle: "Importar contactos",
          importMessage: "¿Desea importar todos los contactos de WhatsApp?",
        },
        toasts: {
          deleted: "Contacto eliminado con éxito.",
        },
      },
      whatsappModal: {
        title: {
          add: "Agregar WhatsApp",
          edit: "Editar WhatsApp",
        },
        form: {
          name: "Nombre",
          default: "Predeterminado",
        },
        buttons: {
          cancel: "Cancelar",
          save: "Guardar",
        },
        success: {
          add: "WhatsApp agregado con éxito.",
          edit: "WhatsApp editado con éxito.",
        },
      },
      qrcodeModal: {
        title: "QR Code",
        message: "Escanee el QR Code para conectar",
        waiting: "Esperando QR Code...",
      },
      contactModal: {
        title: {
          add: "Agregar Contacto",
          edit: "Editar Contacto",
        },
        form: {
          name: "Nombre",
          number: "Número",
          email: "Email",
        },
        buttons: {
          cancel: "Cancelar",
          save: "Guardar",
        },
        success: {
          add: "Contacto agregado con éxito.",
          edit: "Contacto editado con éxito.",
        },
      },
      newTicketModal: {
        title: "Crear Ticket",
        form: {
          queue: "Seleccione una cola",
        },
        buttons: {
          cancel: "Cancelar",
          create: "Crear",
        },
        success: "Ticket creado con éxito.",
        errors: {
          selectQueue: "Seleccione una cola.",
        },
      },
      importContactsModal: {
        title: "Importar Contactos",
        buttons: {
          selectFile: "Seleccionar Archivo CSV",
          cancel: "Cancelar",
          upload: "Importar",
        },
        hint: "Formato: nombre;número;email",
        success: "Contactos importados con éxito.",
        errors: {
          invalidFile: "Archivo inválido. Seleccione un archivo CSV.",
          selectFile: "Seleccione un archivo primero.",
        },
      },
      confirmationModal: {
        buttons: {
          cancel: "Cancelar",
          confirm: "Confirmar",
        },
      },
    },
  },
};

export { messages };
