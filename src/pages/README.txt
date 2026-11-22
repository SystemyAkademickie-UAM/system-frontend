Struktura widoków stron aplikacji (podpiętych bezpośrednio w createAppRouter.jsx)

- pages/<domena>/               — widoki poziomu aplikacji / administracyjne (auth, settings, templates, itp.)
- pages/groups/<sekcja>/        — widoki i podstrony kontekstu grupy (np. group-main, group-members, group-shop)
- pages/groups/group-shared/    — współdzielone layouty i przekierowania grup (GroupLayouts.jsx, GroupLayout.css)
