import { Component, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { WorkManagement } from './components/work-management/work-management';
import { SerieManagement } from './components/serie-management/serie-management';
import { FranchiseManagement } from './components/franchise-management/franchise-management';
import { AuthorManagement } from './components/author-management/author-management';
import { IllustratorManagement } from './components/illustrator-management/illustrator-management';
import { UserManagement } from './components/user-management/user-management';

interface ManagementTab {
  value: string;
  label: string;
  content: Type<unknown>;
}

@Component({
  selector: 'app-management-page',
  imports: [Tabs, TabList, Tab, TabPanels, TabPanel, NgComponentOutlet],
  templateUrl: './management-page.html',
})
export class ManagementPage {
  protected readonly tables: ManagementTab[] = [
    { value: 'work', label: 'Obras', content: WorkManagement },
    { value: 'serie', label: 'Séries', content: SerieManagement },
    { value: 'franchise', label: 'Franquias', content: FranchiseManagement },
    { value: 'author', label: 'Autores', content: AuthorManagement },
    { value: 'illustrator', label: 'Ilustradores', content: IllustratorManagement },
    { value: 'user', label: 'Usuários', content: UserManagement },
  ];
}
