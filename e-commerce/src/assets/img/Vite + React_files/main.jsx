import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=5718d826"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=5718d826"; const StrictMode = __vite__cjsImport1_react["StrictMode"];
import __vite__cjsImport2_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=5718d826"; const createRoot = __vite__cjsImport2_reactDom_client["createRoot"];
import { BrowserRouter as Router, Routes, Route } from "/node_modules/.vite/deps/react-router-dom.js?v=5718d826";
import Home from "/src/pages/Home.jsx";
import Login from "/src/pages/Login.jsx";
import Register from "/src/pages/Registes.jsx";
import DashBoard from "/src/pages/DashBoard.jsx";
import DashboardHome from "/src/componentes/DashBoard/DashboardHome.jsx";
import ListaProdutos from "/src/componentes/DashBoard/Produtos/ListaProdutos.jsx?t=1767125867334";
import CriarProduto from "/src/componentes/DashBoard/Produtos/CriarProduto.jsx";
import EditarProduto from "/src/componentes/DashBoard/Produtos/EditarProduto.jsx";
import ListaUsuarios from "/src/componentes/DashBoard/Usuarios/ListaUsuarios.jsx";
import EditarUsuario from "/src/componentes/DashBoard/Usuarios/EditarUsuario.jsx";
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxDEV(StrictMode, { children: /* @__PURE__ */ jsxDEV(Router, { children: /* @__PURE__ */ jsxDEV(Routes, { children: [
    /* @__PURE__ */ jsxDEV(Route, { path: "/home", element: /* @__PURE__ */ jsxDEV(Home, {}, void 0, false, {
      fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
      lineNumber: 24,
      columnNumber: 38
    }, this) }, void 0, false, {
      fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
      lineNumber: 24,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(Route, { path: "/login", element: /* @__PURE__ */ jsxDEV(Login, {}, void 0, false, {
      fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
      lineNumber: 25,
      columnNumber: 39
    }, this) }, void 0, false, {
      fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
      lineNumber: 25,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(Route, { path: "/register", element: /* @__PURE__ */ jsxDEV(Register, {}, void 0, false, {
      fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
      lineNumber: 26,
      columnNumber: 42
    }, this) }, void 0, false, {
      fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
      lineNumber: 26,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(Route, { path: "/dashboard", element: /* @__PURE__ */ jsxDEV(DashBoard, {}, void 0, false, {
      fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
      lineNumber: 29,
      columnNumber: 43
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Route, { index: true, element: /* @__PURE__ */ jsxDEV(DashboardHome, {}, void 0, false, {
        fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
        lineNumber: 30,
        columnNumber: 33
      }, this) }, void 0, false, {
        fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
        lineNumber: 30,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "produtos", element: /* @__PURE__ */ jsxDEV(ListaProdutos, {}, void 0, false, {
        fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
        lineNumber: 33,
        columnNumber: 43
      }, this) }, void 0, false, {
        fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
        lineNumber: 33,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "produtos/novo", element: /* @__PURE__ */ jsxDEV(CriarProduto, {}, void 0, false, {
        fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
        lineNumber: 34,
        columnNumber: 48
      }, this) }, void 0, false, {
        fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
        lineNumber: 34,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "produtos/editar/:id", element: /* @__PURE__ */ jsxDEV(EditarProduto, {}, void 0, false, {
        fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
        lineNumber: 35,
        columnNumber: 54
      }, this) }, void 0, false, {
        fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
        lineNumber: 35,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "usuarios", element: /* @__PURE__ */ jsxDEV(ListaUsuarios, {}, void 0, false, {
        fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
        lineNumber: 38,
        columnNumber: 43
      }, this) }, void 0, false, {
        fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
        lineNumber: 38,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "usuarios/editar/:id", element: /* @__PURE__ */ jsxDEV(EditarUsuario, {}, void 0, false, {
        fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
        lineNumber: 39,
        columnNumber: 54
      }, this) }, void 0, false, {
        fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
        lineNumber: 39,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
      lineNumber: 29,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
    lineNumber: 21,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
    lineNumber: 20,
    columnNumber: 5
  }, this) }, void 0, false, {
    fileName: "C:/Users/thiag/OneDrive/Projeto/Projetos/e-commerce/e-commerce/src/main.jsx",
    lineNumber: 19,
    columnNumber: 3
  }, this)
);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBdUJxQztBQXZCckMsU0FBU0Esa0JBQWtCO0FBQzNCLFNBQVNDLGtCQUFrQjtBQUMzQixTQUFTQyxpQkFBaUJDLFFBQVFDLFFBQVFDLGFBQWE7QUFFdkQsT0FBT0MsVUFBVTtBQUNqQixPQUFPQyxXQUFXO0FBQ2xCLE9BQU9DLGNBQWM7QUFDckIsT0FBT0MsZUFBZTtBQUd0QixPQUFPQyxtQkFBbUI7QUFDMUIsT0FBT0MsbUJBQW1CO0FBQzFCLE9BQU9DLGtCQUFrQjtBQUN6QixPQUFPQyxtQkFBbUI7QUFDMUIsT0FBT0MsbUJBQW1CO0FBQzFCLE9BQU9DLG1CQUFtQjtBQUUxQmQsV0FBV2UsU0FBU0MsZUFBZSxNQUFNLENBQUMsRUFBRUM7QUFBQUEsRUFDMUMsdUJBQUMsY0FDQyxpQ0FBQyxVQUNDLGlDQUFDLFVBR0M7QUFBQSwyQkFBQyxTQUFNLE1BQUssU0FBUSxTQUFTLHVCQUFDLFVBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFLLEtBQWxDO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBc0M7QUFBQSxJQUN0Qyx1QkFBQyxTQUFNLE1BQUssVUFBUyxTQUFTLHVCQUFDLFdBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFNLEtBQXBDO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBd0M7QUFBQSxJQUN4Qyx1QkFBQyxTQUFNLE1BQUssYUFBWSxTQUFTLHVCQUFDLGNBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFTLEtBQTFDO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBOEM7QUFBQSxJQUc5Qyx1QkFBQyxTQUFNLE1BQUssY0FBYSxTQUFTLHVCQUFDLGVBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFVLEdBQzFDO0FBQUEsNkJBQUMsU0FBTSxPQUFLLE1BQUMsU0FBUyx1QkFBQyxtQkFBRDtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQWMsS0FBcEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUF3QztBQUFBLE1BR3hDLHVCQUFDLFNBQU0sTUFBSyxZQUFXLFNBQVMsdUJBQUMsbUJBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUFjLEtBQTlDO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBa0Q7QUFBQSxNQUNsRCx1QkFBQyxTQUFNLE1BQUssaUJBQWdCLFNBQVMsdUJBQUMsa0JBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUFhLEtBQWxEO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBc0Q7QUFBQSxNQUN0RCx1QkFBQyxTQUFNLE1BQUssdUJBQXNCLFNBQVMsdUJBQUMsbUJBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUFjLEtBQXpEO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBNkQ7QUFBQSxNQUc3RCx1QkFBQyxTQUFNLE1BQUssWUFBVyxTQUFTLHVCQUFDLG1CQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBYyxLQUE5QztBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQWtEO0FBQUEsTUFDbEQsdUJBQUMsU0FBTSxNQUFLLHVCQUFzQixTQUFTLHVCQUFDLG1CQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBYyxLQUF6RDtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQTZEO0FBQUEsU0FWL0Q7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQVdBO0FBQUEsT0FuQkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQXFCQSxLQXRCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBdUJBLEtBeEJGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0F5QkE7QUFDRiIsIm5hbWVzIjpbIlN0cmljdE1vZGUiLCJjcmVhdGVSb290IiwiQnJvd3NlclJvdXRlciIsIlJvdXRlciIsIlJvdXRlcyIsIlJvdXRlIiwiSG9tZSIsIkxvZ2luIiwiUmVnaXN0ZXIiLCJEYXNoQm9hcmQiLCJEYXNoYm9hcmRIb21lIiwiTGlzdGFQcm9kdXRvcyIsIkNyaWFyUHJvZHV0byIsIkVkaXRhclByb2R1dG8iLCJMaXN0YVVzdWFyaW9zIiwiRWRpdGFyVXN1YXJpbyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsibWFpbi5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RyaWN0TW9kZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgY3JlYXRlUm9vdCB9IGZyb20gJ3JlYWN0LWRvbS9jbGllbnQnXG5pbXBvcnQgeyBCcm93c2VyUm91dGVyIGFzIFJvdXRlciwgUm91dGVzLCBSb3V0ZSB9IGZyb20gXCJyZWFjdC1yb3V0ZXItZG9tXCI7XG5cbmltcG9ydCBIb21lIGZyb20gJy4vcGFnZXMvSG9tZS5qc3gnXG5pbXBvcnQgTG9naW4gZnJvbSAnLi9wYWdlcy9Mb2dpbi5qc3gnXG5pbXBvcnQgUmVnaXN0ZXIgZnJvbSAnLi9wYWdlcy9SZWdpc3Rlcy5qc3gnXG5pbXBvcnQgRGFzaEJvYXJkIGZyb20gJy4vcGFnZXMvRGFzaEJvYXJkLmpzeCdcblxuLy8gY29tcG9uZW50ZXMgaW50ZXJub3MgZG8gZGFzaGJvYXJkXG5pbXBvcnQgRGFzaGJvYXJkSG9tZSBmcm9tICcuL2NvbXBvbmVudGVzL0Rhc2hCb2FyZC9EYXNoYm9hcmRIb21lLmpzeCdcbmltcG9ydCBMaXN0YVByb2R1dG9zIGZyb20gJy4vY29tcG9uZW50ZXMvRGFzaEJvYXJkL1Byb2R1dG9zL0xpc3RhUHJvZHV0b3MuanN4J1xuaW1wb3J0IENyaWFyUHJvZHV0byBmcm9tICcuL2NvbXBvbmVudGVzL0Rhc2hCb2FyZC9Qcm9kdXRvcy9DcmlhclByb2R1dG8uanN4J1xuaW1wb3J0IEVkaXRhclByb2R1dG8gZnJvbSAnLi9jb21wb25lbnRlcy9EYXNoQm9hcmQvUHJvZHV0b3MvRWRpdGFyUHJvZHV0by5qc3gnXG5pbXBvcnQgTGlzdGFVc3VhcmlvcyBmcm9tICcuL2NvbXBvbmVudGVzL0Rhc2hCb2FyZC9Vc3Vhcmlvcy9MaXN0YVVzdWFyaW9zLmpzeCdcbmltcG9ydCBFZGl0YXJVc3VhcmlvIGZyb20gJy4vY29tcG9uZW50ZXMvRGFzaEJvYXJkL1VzdWFyaW9zL0VkaXRhclVzdWFyaW8uanN4J1xuXG5jcmVhdGVSb290KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykpLnJlbmRlcihcbiAgPFN0cmljdE1vZGU+XG4gICAgPFJvdXRlcj5cbiAgICAgIDxSb3V0ZXM+XG5cbiAgICAgICAgey8qIHDDumJsaWNhcyAqL31cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvaG9tZVwiIGVsZW1lbnQ9ezxIb21lIC8+fSAvPlxuICAgICAgICA8Um91dGUgcGF0aD1cIi9sb2dpblwiIGVsZW1lbnQ9ezxMb2dpbiAvPn0gLz5cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvcmVnaXN0ZXJcIiBlbGVtZW50PXs8UmVnaXN0ZXIgLz59IC8+XG5cbiAgICAgICAgey8qIERBU0hCT0FSRCAqL31cbiAgICAgICAgPFJvdXRlIHBhdGg9XCIvZGFzaGJvYXJkXCIgZWxlbWVudD17PERhc2hCb2FyZCAvPn0+XG4gICAgICAgICAgPFJvdXRlIGluZGV4IGVsZW1lbnQ9ezxEYXNoYm9hcmRIb21lIC8+fSAvPlxuXG4gICAgICAgICAgey8qIHByb2R1dG9zICovfVxuICAgICAgICAgIDxSb3V0ZSBwYXRoPVwicHJvZHV0b3NcIiBlbGVtZW50PXs8TGlzdGFQcm9kdXRvcyAvPn0gLz5cbiAgICAgICAgICA8Um91dGUgcGF0aD1cInByb2R1dG9zL25vdm9cIiBlbGVtZW50PXs8Q3JpYXJQcm9kdXRvIC8+fSAvPlxuICAgICAgICAgIDxSb3V0ZSBwYXRoPVwicHJvZHV0b3MvZWRpdGFyLzppZFwiIGVsZW1lbnQ9ezxFZGl0YXJQcm9kdXRvIC8+fSAvPlxuXG4gICAgICAgICAgey8qIHVzdcOhcmlvcyAqL31cbiAgICAgICAgICA8Um91dGUgcGF0aD1cInVzdWFyaW9zXCIgZWxlbWVudD17PExpc3RhVXN1YXJpb3MgLz59IC8+XG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCJ1c3Vhcmlvcy9lZGl0YXIvOmlkXCIgZWxlbWVudD17PEVkaXRhclVzdWFyaW8gLz59IC8+XG4gICAgICAgIDwvUm91dGU+XG5cbiAgICAgIDwvUm91dGVzPlxuICAgIDwvUm91dGVyPlxuICA8L1N0cmljdE1vZGU+XG4pXG4iXSwiZmlsZSI6IkM6L1VzZXJzL3RoaWFnL09uZURyaXZlL1Byb2pldG8vUHJvamV0b3MvZS1jb21tZXJjZS9lLWNvbW1lcmNlL3NyYy9tYWluLmpzeCJ9