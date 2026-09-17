import type {StructureResolver} from 'sanity/structure'

const singletonItem = (
  S: Parameters<StructureResolver>[0],
  title: string,
  schemaType: string,
  documentId: string,
) =>
  S.listItem()
    .title(title)
    .id(documentId)
    .child(S.document().schemaType(schemaType).documentId(documentId).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      singletonItem(S, 'Culture page', 'aboutPage', 'culturePage'),
      S.listItem().title('Projects').child(S.documentTypeList('project').title('Projects')),
      S.listItem()
        .title('Topologies')
        .child(
          S.documentTypeList('topology')
            .title('Topologies')
            .defaultOrdering([{field: 'title', direction: 'asc'}]),
        ),
      S.listItem()
        .title('Team')
        .child(
          S.list()
            .title('Team')
            .items([
              singletonItem(S, 'Customize Teams Page', 'teamPage', 'teamPage'),
              S.divider(),
              S.listItem()
                .title('All staff')
                .child(
                  S.documentTypeList('teamMember')
                    .title('All staff')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),
              S.listItem()
                .title('Current staff')
                .child(
                  S.documentList()
                    .title('Current staff')
                    .schemaType('teamMember')
                    .filter('_type == "teamMember" && membershipStatus == "current"')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),
              S.listItem()
                .title('Former staff')
                .child(
                  S.documentList()
                    .title('Former staff')
                    .schemaType('teamMember')
                    .filter('_type == "teamMember" && membershipStatus == "former"')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),
            ]),
        ),
    ])
